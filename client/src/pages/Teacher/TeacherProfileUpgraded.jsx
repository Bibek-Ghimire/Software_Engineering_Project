import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Upload,
  Edit2,
  Save,
  X,
  Github,
  Linkedin,
  Mail,
  FileText,
  Plus,
  BookOpen,
  Award,
  GraduationCap,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import TeacherSidebar from "../../components/TeacherSidebar";

const TeacherProfileUpgraded = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profilePicture: "",
    bio: "",
    department: "",
    qualification: "",
    subject: "",
    achievements: [],
    skills: [],
    interests: [],
    github: "",
    linkedin: "",
    resume: "",
  });

  const [formData, setFormData] = useState({ ...profile });
  const [previewImage, setPreviewImage] = useState(null);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newAchievement, setNewAchievement] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        setFormData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token, navigate]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Handle profile picture change
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, profilePicture: file });
    }
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Add skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  // Remove skill
  const handleRemoveSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  // Add achievement
  const handleAddAchievement = () => {
    if (
      newAchievement.trim() &&
      !formData.achievements.includes(newAchievement.trim())
    ) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, newAchievement.trim()],
      });
      setNewAchievement("");
    }
  };

  // Remove achievement
  const handleRemoveAchievement = (index) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index),
    });
  };

  // Add interest
  const handleAddInterest = () => {
    if (
      newInterest.trim() &&
      !formData.interests.includes(newInterest.trim())
    ) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()],
      });
      setNewInterest("");
    }
  };

  // Remove interest
  const handleRemoveInterest = (index) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((_, i) => i !== index),
    });
  };

  // Save profile
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("bio", formData.bio);
      data.append("department", formData.department);
      data.append("qualification", formData.qualification);
      data.append("subject", formData.subject);
      data.append("skills", JSON.stringify(formData.skills));
      data.append("interests", JSON.stringify(formData.interests));
      data.append("achievements", JSON.stringify(formData.achievements));
      data.append("github", formData.github);
      data.append("linkedin", formData.linkedin);

      if (formData.profilePicture instanceof File) {
        data.append("profilePicture", formData.profilePicture);
      }

      const res = await axios.put("http://localhost:5000/api/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(res.data);
      setIsEditing(false);
      setPreviewImage(null);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen page-surface">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-orange-700 dark:text-orange-300">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen page-surface">
      <TeacherSidebar />

      <div className="flex-1 p-8 lg:p-12 relative">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-8 right-8 icon-action absolute top-8 right-8 z-10"
        >
          {darkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="section-title">
              Instructor Profile
            </h1>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (isEditing) {
                  setFormData(profile);
                  setPreviewImage(null);
                }
                setIsEditing(!isEditing);
              }}
              className={isEditing ? "secondary-action" : "primary-action"}
            >
              {isEditing ? (
                <>
                  <X className="w-5 h-5" /> Cancel
                </>
              ) : (
                <>
                  <Edit2 className="w-5 h-5" /> Edit Profile
                </>
              )}
            </motion.button>
          </div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="surface-card overflow-hidden"
          >
            {/* Profile Picture Section */}
            <div className="bg-stone-800 dark:bg-stone-950 h-40 relative">
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>

            <div className="px-8 py-6 relative">
              {/* Profile Picture */}
              <div className="relative -mt-28 mb-8">
                <div className="relative inline-block">
                  {previewImage || (profile.profilePicture && !isEditing) ? (
                    <img
                      src={
                        previewImage ||
                        `http://localhost:5000${profile.profilePicture}`
                      }
                      alt="Profile"
                      className="w-32 h-32 rounded-2xl border-4 border-white dark:border-stone-900 shadow-xl object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-stone-900 shadow-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-900 dark:text-stone-50 text-4xl font-bold brand-title">
                      {profile.name?.[0]?.toUpperCase()}
                    </div>
                  )}

                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-xl cursor-pointer shadow-lg transition-all hover:scale-110">
                      <Upload className="w-5 h-5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-6">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black body-copy uppercase tracking-widest mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    ) : (
                      <p className="text-lg font-bold text-stone-900 dark:text-white">
                        {profile.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black body-copy uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-orange-500" /> Email
                    </label>
                    <p className="text-lg font-medium text-stone-600 dark:text-stone-400 surface-panel px-4 py-3">
                      {profile.email}
                    </p>
                  </div>
                </div>

                {/* Department and Qualification */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black body-copy uppercase tracking-widest mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-orange-500" /> Department
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="Enter department"
                        className="form-input"
                      />
                    ) : (
                      <p className="text-stone-700 dark:text-stone-300 font-medium">
                        {profile.department || "Not specified"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black body-copy uppercase tracking-widest mb-2 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-orange-500" /> Qualification
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleInputChange}
                        placeholder="e.g., M.Sc, Ph.D"
                        className="form-input"
                      />
                    ) : (
                      <p className="text-stone-700 dark:text-stone-300 font-medium">
                        {profile.qualification || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-black body-copy uppercase tracking-widest mb-2">
                    Subject / Specialization
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="Enter your subject/specialization"
                      className="form-input"
                    />
                  ) : (
                    <p className="text-stone-700 dark:text-stone-300 font-medium">
                      {profile.subject || "Not specified"}
                    </p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-black body-copy uppercase tracking-widest mb-2">
                    Bio / About Me
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about your teaching experience and expertise..."
                      rows="4"
                      className="form-input resize-none"
                    />
                  ) : (
                    <p className="body-copy leading-relaxed">
                      {profile.bio || "No bio added yet"}
                    </p>
                  )}
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-xs font-black body-copy uppercase tracking-widest mb-3">
                    Teaching Skills
                  </label>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddSkill();
                            }
                          }}
                          placeholder="Add a skill..."
                          className="form-input"
                        />
                        <button
                          onClick={handleAddSkill}
                          className="primary-action whitespace-nowrap"
                        >
                          <Plus className="w-4 h-4" /> Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-stone-800 dark:bg-stone-700 text-stone-100 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm"
                          >
                            {skill}
                            <button
                              onClick={() => handleRemoveSkill(index)}
                              className="hover:bg-white/20 rounded-lg p-1 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.length > 0 ? (
                        formData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 px-4 py-2 rounded-xl text-sm font-semibold shadow-sm"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="body-copy text-sm">No skills added yet</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Achievements */}
                <div>
                  <label className="block text-xs font-black body-copy uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-orange-500" /> Achievements & Awards
                  </label>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAchievement}
                          onChange={(e) => setNewAchievement(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddAchievement();
                            }
                          }}
                          placeholder="Add an achievement..."
                          className="form-input"
                        />
                        <button
                          onClick={handleAddAchievement}
                          className="primary-action whitespace-nowrap"
                        >
                          <Plus className="w-4 h-4" /> Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {formData.achievements.map((achievement, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold shadow-md shadow-orange-600/20"
                          >
                            {achievement}
                            <button
                              onClick={() => handleRemoveAchievement(index)}
                              className="hover:bg-white/20 rounded-lg p-1 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.achievements.length > 0 ? (
                        formData.achievements.map((achievement, index) => (
                          <span
                            key={index}
                            className="bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-900/40 px-4 py-2 rounded-xl text-sm font-bold"
                          >
                            {achievement}
                          </span>
                        ))
                      ) : (
                        <p className="body-copy text-sm">No achievements added yet</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-xs font-black body-copy uppercase tracking-widest mb-3">
                    Interests
                  </label>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newInterest}
                          onChange={(e) => setNewInterest(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddInterest();
                            }
                          }}
                          placeholder="Add an interest..."
                          className="form-input"
                        />
                        <button
                          onClick={handleAddInterest}
                          className="primary-action whitespace-nowrap"
                        >
                          <Plus className="w-4 h-4" /> Add
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {formData.interests.map((interest, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-semibold border border-stone-300 dark:border-stone-700"
                          >
                            {interest}
                            <button
                              onClick={() => handleRemoveInterest(index)}
                              className="hover:bg-stone-300 dark:hover:bg-stone-700 rounded-lg p-1 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.length > 0 ? (
                        formData.interests.map((interest, index) => (
                          <span
                            key={index}
                            className="bg-stone-50 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 px-4 py-2 rounded-xl text-sm font-medium"
                          >
                            {interest}
                          </span>
                        ))
                      ) : (
                        <p className="body-copy text-sm">No interests added yet</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black body-copy uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Github className="w-4 h-4 text-stone-400" /> GitHub URL
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        placeholder="https://github.com/username"
                        className="form-input"
                      />
                    ) : (
                      <>
                        {profile.github ? (
                          <a
                            href={profile.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 dark:text-orange-400 hover:underline font-semibold break-all"
                          >
                            {profile.github}
                          </a>
                        ) : (
                          <p className="body-copy text-sm">Not provided</p>
                        )}
                      </>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-black body-copy uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-stone-400" /> LinkedIn URL
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/username"
                        className="form-input"
                      />
                    ) : (
                      <>
                        {profile.linkedin ? (
                          <a
                            href={profile.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-orange-600 dark:text-orange-400 hover:underline font-semibold break-all"
                          >
                            {profile.linkedin}
                          </a>
                        ) : (
                          <p className="body-copy text-sm">Not provided</p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="w-full mt-8 primary-action py-4 text-lg font-bold shadow-lg shadow-orange-600/20"
                  >
                    {saving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" /> Save Profile
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherProfileUpgraded;

