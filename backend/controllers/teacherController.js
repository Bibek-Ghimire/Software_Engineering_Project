import User from "../models/User.js";

// @desc    Get logged-in teacher profile
// @route   GET /api/teachers/profile
// @access  Private (teacher only)
const getTeacherProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "teacher") {
      return res.status(403).json({ message: "Not authorized as teacher" });
    }

    const teacher = req.user; // already fetched by protectTeacher

    res.json({
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      department: teacher.department || "",
      qualification: teacher.qualification || "",
      subject: teacher.subject || "",
      bio: teacher.bio || "",
      achievements: teacher.achievements || "",
      profilePicture: teacher.profilePicture || "",
      skills: teacher.skills || [],
      interests: teacher.interests || [],
      github: teacher.github || "",
      linkedin: teacher.linkedin || "",
      resume: teacher.resume || "",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update teacher profile
// @route   PUT /api/teachers/profile
// @access  Private (teacher only)
const updateTeacherProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "teacher") {
      return res.status(403).json({ message: "Not authorized as teacher" });
    }

    const teacher = req.user;

    // Update only the fields sent in body
    teacher.name = req.body.name || teacher.name;
    teacher.email = req.body.email || teacher.email;
    teacher.department = req.body.department || teacher.department;
    teacher.qualification = req.body.qualification || teacher.qualification;
    teacher.subject = req.body.subject || teacher.subject;
    teacher.bio = req.body.bio || teacher.bio;
    teacher.achievements = req.body.achievements || teacher.achievements;
    teacher.skills = req.body.skills || teacher.skills;
    teacher.interests = req.body.interests || teacher.interests;
    teacher.github = req.body.github || teacher.github;
    teacher.linkedin = req.body.linkedin || teacher.linkedin;
    teacher.resume = req.body.resume || teacher.resume;
    teacher.profilePicture = req.body.profilePicture || teacher.profilePicture;

    const updatedTeacher = await teacher.save();

    res.json({
      id: updatedTeacher._id,
      name: updatedTeacher.name,
      email: updatedTeacher.email,
      department: updatedTeacher.department,
      qualification: updatedTeacher.qualification,
      subject: updatedTeacher.subject,
      bio: updatedTeacher.bio,
      achievements: updatedTeacher.achievements,
      skills: updatedTeacher.skills,
      interests: updatedTeacher.interests,
      github: updatedTeacher.github,
      linkedin: updatedTeacher.linkedin,
      resume: updatedTeacher.resume,
      profilePicture: updatedTeacher.profilePicture,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export { getTeacherProfile, updateTeacherProfile };
