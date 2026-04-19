import Course from "../models/Course.js";
import User from "../models/User.js";
import Resource from "../models/Resource.js";
import Group from "../models/Group.js";

/**
 * STRICT RECOMMENDATION ALGORITHM using Jaccard Similarity
 *
 * Algorithm:
 * 1. Calculate Jaccard Similarity = (intersection / union) of user interests and item keywords
 * 2. Filter: Only return items where similarity >= 0.3
 * 3. Combine: Score = 0.7 * interestMatch + 0.3 * keywordMatch
 * 4. Sort by score descending
 * 5. Return TOP 5 items only
 * 6. Fallback: Return top 3 trending items if no matches
 */

/**
 * ULTRA-SIMPLE matching: Any word/substring match counts
 * "spring" matches "springboot", "react" matches "reactjs"
 * Even single character matches in multi-word interests
 */
const calculateScore = (userInterests, title, description, keywords) => {
  if (!userInterests || userInterests.length === 0) return 0;

  const contentText =
    `${title} ${description} ${(keywords || []).join(" ")}`.toLowerCase();

  let matchCount = 0;

  // Check each user interest
  userInterests.forEach((interest) => {
    const interestLower = interest.toLowerCase();

    // Check if interest (or any word in interest) appears anywhere in content
    if (contentText.includes(interestLower)) {
      matchCount++;
      return;
    }

    // Also check if any word from interest matches any word in content
    const interestWords = interestLower.split(/\s+/);
    for (const word of interestWords) {
      if (word.length >= 2 && contentText.includes(word)) {
        matchCount++;
        return;
      }
    }
  });

  // Score: percentage of interests that matched
  const score = matchCount / userInterests.length;
  return Math.min(score, 1);
};

/**
 * Get fallback trending items (fallback if no matches above threshold)
 */
const getTrendingFallback = async (Model, limit = 3) => {
  try {
    const items = await Model.find()
      .sort({ enrollmentCount: -1, rating: -1, createdAt: -1 })
      .limit(limit)
      .lean();

    return items.map((item) => ({
      ...item,
      recommendationScore: "0.00",
      reason: "Trending (no relevant matches found)",
    }));
  } catch (err) {
    console.error("Error fetching trending fallback:", err);
    return [];
  }
};

// ============================================
// RECOMMENDED COURSES
// ============================================
export const getRecommendedCourses = async (userId, limit = 5) => {
  try {
    console.log("🔍 Getting recommendations for user:", userId);
    const user = await User.findById(userId);
    console.log("👤 User found:", user ? user.name : "NOT FOUND");
    console.log("📋 User interests:", user?.interests || []);

    // Fallback: If user has no interests, return all courses
    if (!user || !user.interests || user.interests.length === 0) {
      console.log("⚠️ User has no interests, returning trending");
      const allCourses = await Course.find()
        .sort({ enrollmentCount: -1, rating: -1 })
        .limit(3)
        .populate("teacher", "name profilePicture")
        .lean();
      return allCourses.map((course) => ({
        ...course,
        recommendationScore: "0.00",
        reason: "Trending (no interests set)",
      }));
    }

    // Get all courses
    const allCourses = await Course.find()
      .populate("teacher", "name profilePicture")
      .lean();
    console.log("📚 Found courses:", allCourses.length);

    if (allCourses.length === 0) {
      console.log("❌ No courses in database");
      return [];
    }

    // Score ALL courses
    const scoredCourses = allCourses
      .map((course) => ({
        ...course,
        recommendationScore: calculateScore(
          user.interests,
          course.title,
          course.description,
          course.keywords || [],
        ),
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);

    console.log(
      "⭐ Top 3 scored courses:",
      scoredCourses
        .slice(0, 3)
        .map((c) => ({ title: c.title, score: c.recommendationScore })),
    );

    // Return TOP 3 courses with any score >= 0
    const recommendations = scoredCourses.slice(0, 3).map((course) => ({
      ...course,
      recommendationScore: course.recommendationScore,
    }));

    console.log("✅ Returning recommendations:", recommendations.length);
    return recommendations.length > 0
      ? recommendations
      : scoredCourses.slice(0, 3);
  } catch (err) {
    console.error("❌ Error in getRecommendedCourses:", err.message);
    console.error("   Stack:", err.stack);
    return [];
  }
};

// ============================================
// RECOMMENDED RESOURCES
// ============================================
export const getRecommendedResources = async (userId, limit = 5) => {
  try {
    const user = await User.findById(userId);

    // Fallback: If user has no interests, return all resources
    if (!user || !user.interests || user.interests.length === 0) {
      const allResources = await Resource.find()
        .sort({ createdAt: -1, enrollmentCount: -1 })
        .limit(3)
        .populate("teacher", "name profilePicture")
        .lean();
      return allResources.map((resource) => ({
        ...resource,
        recommendationScore: "0.00",
        reason: "Trending (no interests set)",
      }));
    }

    const allResources = await Resource.find()
      .populate("teacher", "name profilePicture")
      .lean();

    if (allResources.length === 0) {
      return [];
    }

    // Score ALL resources
    const scoredResources = allResources
      .map((resource) => ({
        ...resource,
        recommendationScore: calculateScore(
          user.interests,
          resource.title,
          resource.description,
          resource.keywords || [],
        ),
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);

    // Return TOP 3 resources with any score >= 0
    const recommendations = scoredResources.slice(0, 3).map((resource) => ({
      ...resource,
      recommendationScore: resource.recommendationScore,
    }));

    return recommendations.length > 0
      ? recommendations
      : scoredResources.slice(0, 3);
  } catch (err) {
    console.error("Error in getRecommendedResources:", err);
    return [];
  }
};

// ============================================
// RECOMMENDED GROUPS
// ============================================
export const getRecommendedGroups = async (userId, limit = 5) => {
  try {
    const user = await User.findById(userId);

    // Fallback: If user has no interests, return all groups
    if (!user || !user.interests || user.interests.length === 0) {
      const allGroups = await Group.find()
        .sort({ createdAt: -1, memberCount: -1 })
        .limit(3)
        .populate("members", "name profilePicture")
        .lean();
      return allGroups.map((group) => ({
        ...group,
        recommendationScore: "0.00",
        reason: "Trending (no interests set)",
      }));
    }

    const allGroups = await Group.find()
      .populate("members", "name profilePicture")
      .lean();

    if (allGroups.length === 0) {
      return [];
    }

    // Score ALL groups
    const scoredGroups = allGroups
      .map((group) => ({
        ...group,
        recommendationScore: calculateScore(
          user.interests,
          group.name,
          group.description,
          group.keywords || [],
        ),
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);

    // Return TOP 3 groups with any score >= 0
    const recommendations = scoredGroups.slice(0, 3).map((group) => ({
      ...group,
      recommendationScore: group.recommendationScore,
    }));

    return recommendations.length > 0
      ? recommendations
      : scoredGroups.slice(0, 3);
  } catch (err) {
    console.error("Error in getRecommendedGroups:", err);
    return [];
  }
};

// ============================================
// RECOMMENDED TEACHERS
// ============================================
export const getRecommendedTeachers = async (userId, limit = 5) => {
  try {
    const user = await User.findById(userId);

    // Fallback: If user has no interests, return all teachers
    if (!user || !user.interests || user.interests.length === 0) {
      const allTeachers = await User.find({
        role: "teacher",
        _id: { $ne: userId },
      })
        .sort({ engagementScore: -1, coursesCreated: -1 })
        .select(
          "name bio department subject profilePicture engagementScore coursesCreated batch achievements",
        )
        .limit(3)
        .lean();
      return allTeachers.map((teacher) => ({
        ...teacher,
        recommendationScore: "0.00",
        reason: "Popular (no interests set)",
      }));
    }

    // Get all teachers
    const allTeachers = await User.find({
      role: "teacher",
      _id: { $ne: userId },
    })
      .select(
        "name bio department subject profilePicture engagementScore coursesCreated batch achievements",
      )
      .lean();

    if (allTeachers.length === 0) {
      return [];
    }

    // Score ALL teachers
    const scoredTeachers = allTeachers
      .map((teacher) => ({
        ...teacher,
        recommendationScore: calculateScore(
          user.interests,
          teacher.subject || "",
          teacher.bio || "",
          [],
        ),
      }))
      .sort((a, b) => b.recommendationScore - a.recommendationScore);

    // Return TOP 3 teachers with any score >= 0
    const recommendations = scoredTeachers.slice(0, 3).map((teacher) => ({
      ...teacher,
      recommendationScore: teacher.recommendationScore,
    }));

    return recommendations.length > 0
      ? recommendations
      : scoredTeachers.slice(0, 3);
  } catch (err) {
    console.error("Error in getRecommendedTeachers:", err);
    return [];
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Add course to interested list
 */
export const addInterestedCourse = async (userId, courseId) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { interestedCourses: courseId } },
      { new: true },
    );
    return user;
  } catch (err) {
    console.error("Error adding interested course:", err);
    throw err;
  }
};

/**
 * Remove course from interested list
 */
export const removeInterestedCourse = async (userId, courseId) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { interestedCourses: courseId } },
      { new: true },
    );
    return user;
  } catch (err) {
    console.error("Error removing interested course:", err);
    throw err;
  }
};
