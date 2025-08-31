import User from "../models/User.js";
import Course from "../models/Course.js";

// GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" });

    const ranked = await Promise.all(
      teachers.map(async (t) => {
        // Fetch courses created by this teacher
        const courses = await Course.find({ teacher: t._id }).select(
          "title level duration price"
        );

        // Total score calculation
        const totalScore = (courses.length || 0) * 5 + (t.engagementScore || 0);

        // Determine batch based on totalScore
        let batch = "Basic";
        if (totalScore >= 200) batch = "Diamond";
        else if (totalScore >= 150) batch = "Platinum";
        else if (totalScore >= 100) batch = "Gold";
        else if (totalScore >= 70) batch = "Silver";
        else if (totalScore >= 40) batch = "Bronze";

        return {
          _id: t._id,
          name: t.name,
          coursesCreated: courses.length,
          engagementScore: t.engagementScore || 0,
          totalScore,
          batch,
          courses: courses || [],
        };
      })
    );

    // Sort by totalScore descending
    ranked.sort((a, b) => b.totalScore - a.totalScore);

    res.json(ranked);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
