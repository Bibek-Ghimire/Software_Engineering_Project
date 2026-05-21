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
    const user = await User.findById(userId);
    if (!user || !user.interests || user.interests.length === 0) {
      return [];
    }

    const allCourses = await Course.find()
      .populate("teacher", "name profilePicture")
      .lean();

    if (!allCourses || allCourses.length === 0) {
      return [];
    }

    // Step 1: Calculate scores
    const result = [];
    for (let i = 0; i < allCourses.length; i++) {
      const course = allCourses[i];
      const score = calculateScore(
        user.interests,
        course.title,
        course.description,
        course.keywords || [],
      );

      // Step 2: ONLY add if score is strictly greater than 0
      if (score > 0) {
        result.push({ ...course, recommendationScore: score });
      }
    }

    // Step 3: Sort by score
    result.sort((a, b) => b.recommendationScore - a.recommendationScore);

    // Step 4: Return ONLY matched courses
    return result;
  } catch (err) {
    console.error("Error in getRecommendedCourses:", err);
    return [];
  }
};

// ============================================
// RECOMMENDED RESOURCES
// ============================================
export const getRecommendedResources = async (userId, limit = 5) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.interests || user.interests.length === 0) {
      return [];
    }

    const allResources = await Resource.find()
      .populate("teacher", "name profilePicture")
      .lean();

    if (!allResources || allResources.length === 0) {
      return [];
    }

    // Step 1: Calculate scores
    const result = [];
    for (let i = 0; i < allResources.length; i++) {
      const resource = allResources[i];
      const score = calculateScore(
        user.interests,
        resource.title,
        resource.description,
        resource.keywords || [],
      );

      // Step 2: ONLY add if score > 0
      if (score > 0) {
        result.push({ ...resource, recommendationScore: score });
      }
    }

    // Step 3: Sort by score
    result.sort((a, b) => b.recommendationScore - a.recommendationScore);

    // Step 4: Return ONLY matched resources
    return result;
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

    // STRICT: No interests = empty results
    if (!user || !user.interests || user.interests.length === 0) {
      console.log("❌ No user interests - returning empty array");
      return [];
    }

    const allGroups = await Group.find()
      .populate("members", "name profilePicture")
      .lean();

    if (allGroups.length === 0) {
      return [];
    }

    // Calculate scores
    const scoredGroups = allGroups.map((group) => ({
      ...group,
      recommendationScore: calculateScore(
        user.interests,
        group.name,
        group.description,
        group.keywords || [],
      ),
    }));

    scoredGroups.sort((a, b) => b.recommendationScore - a.recommendationScore);

    // ABSOLUTELY STRICT: ONLY groups with score > 0
    const matchedGroups = [];
    for (const group of scoredGroups) {
      if (group.recommendationScore > 0) {
        matchedGroups.push(group);
      }
    }

    return matchedGroups;
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

    // STRICT: No interests = empty results
    if (!user || !user.interests || user.interests.length === 0) {
      console.log("❌ No user interests - returning empty array");
      return [];
    }

    const allTeachers = await User.find({
      role: "teacher",
      _id: { $ne: userId },
    })
      .select(
        "name bio department subject profilePicture engagementScore coursesCreated batch achievements interests",
      )
      .lean();

    if (allTeachers.length === 0) {
      return [];
    }

    // Calculate scores - check subject, bio, department, AND teacher interests
    const result = [];
    for (let i = 0; i < allTeachers.length; i++) {
      const teacher = allTeachers[i];

      // Combine all teacher info for matching: subject + bio + department + interests
      const teacherInfo = `${teacher.subject || ""} ${teacher.bio || ""} ${teacher.department || ""} ${(teacher.interests || []).join(" ")}`;

      const score = calculateScore(
        user.interests,
        teacher.name || "",
        teacherInfo,
        [],
      );

      if (score > 0) {
        result.push({ ...teacher, recommendationScore: score });
      }
    }

    result.sort((a, b) => b.recommendationScore - a.recommendationScore);

    result.sort((a, b) => b.recommendationScore - a.recommendationScore);
    return result;
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

// ============================================
// POPULAR COURSES (Fallback when no recommendations)
// ============================================

/**
 * Get most popular courses based on enrollments and saves
 * Used as fallback when no matching recommendations are available
 *
 * Popularity Score = (enrollmentCount * 0.6) + (savesCount * 0.4)
 * - 60% weight on enrollment count (how many students took it)
 * - 40% weight on saves count (how many students bookmarked it)
 */
export const getPopularCourses = async (limit = 6) => {
  try {
    // Get all courses with teacher info
    const allCourses = await Course.find()
      .populate("teacher", "name profilePicture subject")
      .lean();

    if (!allCourses || allCourses.length === 0) {
      return [];
    }

    // Count saves for each course (how many users have saved this course)
    const courseSaves = await User.aggregate([
      {
        $project: {
          savedCourses: 1,
        },
      },
      {
        $unwind: "$savedCourses",
      },
      {
        $group: {
          _id: "$savedCourses",
          savesCount: { $sum: 1 },
        },
      },
    ]);

    // Create a map of course saves
    const savesMap = {};
    courseSaves.forEach((item) => {
      savesMap[item._id.toString()] = item.savesCount;
    });

    // Calculate popularity score for each course
    const coursesWithScore = allCourses.map((course) => {
      const enrollmentCount = course.enrollmentCount || 0;
      const savesCount = savesMap[course._id.toString()] || 0;

      // Popularity Score = (60% enrollment) + (40% saves)
      const popularityScore = (enrollmentCount * 0.6 + savesCount * 0.4) / 10;

      return {
        ...course,
        savesCount,
        popularityScore: parseFloat(popularityScore.toFixed(2)),
      };
    });

    // Sort by popularity score (highest first)
    coursesWithScore.sort((a, b) => b.popularityScore - a.popularityScore);

    // Filter out courses with 0 score to show only courses with at least some popularity
    const popularCourses = coursesWithScore.filter(
      (course) => course.popularityScore > 0,
    );

    // Return top N courses
    return popularCourses.slice(0, limit);
  } catch (err) {
    console.error("Error fetching popular courses:", err);
    return [];
  }
};
