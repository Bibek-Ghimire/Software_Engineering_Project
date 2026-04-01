// src/pages/TeacherProfile.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Mail,
  BookOpen,
  User,
  GraduationCap,
  Award,
  Save,
  Github,
  Linkedin,
  FileText,
  X,
  Camera,
  Upload,
  Star,
  MapPin,
  Calendar,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import TeacherSidebar from "../../components/TeacherSidebar";
import { useLocation } from "react-router-dom";

const TeacherProfile = () => {
  const token = localStorage.getItem("token");
  const location = useLocation();
  const viewOnly = location.state?.viewOnly || false; // <-- viewOnly flag

  const initialProfile = {
    name: localStorage.getItem("name") || "",
    email: localStorage.getItem("email") || "",
    qualification: "",
    subject: "",
    bio: "",
    achievements: [],
    skills: [],
    interests: [],
    profilePicture: "",
    github: "",
    linkedin: "",
    resume: "",
    college: "",
  };

  const [profile, setProfile] = useState(initialProfile);
  const [formData, setFormData] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // ---------------- Fetch Profile ----------------
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const merged = { ...initialProfile, ...res.data };
        setProfile(merged);
        setFormData(merged);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  // ---------------- Handlers ----------------
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddItem = (field) =>
    setFormData({ ...formData, [field]: [...formData[field], ""] });

  const handleRemoveItem = (field, index) => {
    const updated = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: updated });
  };

  const handleItemChange = (field, index, value) => {
    const updated = [...formData[field]];
    updated[index] = value;
    setFormData({ ...formData, [field]: updated });
  };

  // ---------------- Save Profile ----------------
  const handleSave = async () => {
    try {
      const fd = new FormData();
      const fields = [
        "name",
        "college",
        "qualification",
        "subject",
        "bio",
        "linkedin",
        "github",
      ];
      fields.forEach((f) => fd.append(f, formData[f] || ""));

      fd.append("skills", JSON.stringify(formData.skills || []));
      fd.append("interests", JSON.stringify(formData.interests || []));
      fd.append("achievements", JSON.stringify(formData.achievements || []));

      if (formData.profilePicture instanceof File) {
        fd.append("profilePicture", formData.profilePicture);
      }
      if (formData.resume instanceof File) {
        fd.append("resume", formData.resume);
      }

      const res = await axios.put("http://localhost:5000/api/profile", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(res.data);
      setFormData(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Error saving profile");
    }
  };

  // ---------------- Upload Photo ----------------
  const handlePhotoUpload = async (e) => {
    if (viewOnly) return; // disable if viewOnly
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("profilePicture", file);
    setUploadingPhoto(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/profile/teacher/upload-photo",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setProfile({ ...profile, profilePicture: res.data.profilePicture });
      setFormData({ ...formData, profilePicture: file });
    } catch (err) {
      console.error(err);
      alert("Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  // ---------------- Upload Resume ----------------
  const handleResumeUpload = async (e) => {
    if (viewOnly) return; // disable if viewOnly
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("resume", file);
    setUploadingResume(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/profile/teacher/upload-resume",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setProfile({ ...profile, resume: res.data.resume });
      setFormData({ ...formData, resume: file });
    } catch (err) {
      console.error(err);
      alert("Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-sky-700 animate-pulse">
            Loading profile...
          </p>
        </div>
      </div>
    );

  // ---------------- UI ----------------
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 transition-all duration-700">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <TeacherSidebar />
      </div>
      <div className="ml-72 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-900 w-full">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-200/20 to-blue-300/15 rounded-full blur-3xl -translate-y-48 translate-x-48 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-200/15 to-sky-300/20 rounded-full blur-3xl translate-y-32 -translate-x-32 animate-pulse"></div>

        <motion.div
          className="max-w-6xl mx-auto bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-sky-100/50 dark:border-gray-700/50 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
            <div className="relative group">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                {profile.profilePicture ? (
                  <img
                    src={`http://localhost:5000${profile.profilePicture}`}
                    alt="Teacher"
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl ring-4 ring-sky-200/50 dark:ring-sky-800/50"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl ring-4 ring-sky-200/50 dark:ring-sky-800/50">
                    {profile.name ? profile.name[0] : "T"}
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-400/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
              {isEditing && !viewOnly && (
                <label className="absolute bottom-2 right-2 bg-gradient-to-r from-sky-500 to-blue-600 p-3 rounded-full cursor-pointer hover:from-sky-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 border-2 border-white dark:border-gray-700">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  {uploadingPhoto ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </label>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 dark:from-sky-400 dark:to-blue-500 bg-clip-text text-transparent mb-3 flex items-center justify-center md:justify-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                {profile.name}
              </h1>
              <div className="space-y-2">
                <p className="text-sky-600 dark:text-sky-400 flex items-center justify-center md:justify-start gap-2 text-lg font-medium">
                  <Mail className="w-4 h-4" /> {profile.email}
                </p>
                <p className="text-sky-600 dark:text-sky-400 flex items-center justify-center md:justify-start gap-2">
                  <GraduationCap className="w-4 h-4" />
                  {profile.qualification || "Qualification not added yet"}
                </p>
                <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2">
                  <MapPin className="w-4 h-4" />
                  {profile.college || "Institution not specified"}
                </p>
              </div>
            </div>

            {!viewOnly && (
              <motion.button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-8 py-3 rounded-full shadow-lg font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                  isEditing
                    ? "bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700"
                    : "bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:from-sky-600 hover:to-blue-700"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isEditing ? (
                  <span className="flex items-center gap-2">
                    <X className="w-4 h-4" /> Cancel
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Edit className="w-4 h-4" /> Edit Profile
                  </span>
                )}
              </motion.button>
            )}
          </div>

          {/* Profile Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Section - Teaching Info */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-300">
                  Teaching Information
                </h2>
              </div>

              {isEditing && !viewOnly ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject || ""}
                      onChange={handleChange}
                      placeholder="What subject do you teach?"
                      className="w-full p-4 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide">
                      Qualification
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification || ""}
                      onChange={handleChange}
                      placeholder="Your highest qualification"
                      className="w-full p-4 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide">
                      Institution
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college || ""}
                      onChange={handleChange}
                      placeholder="Your institution/college"
                      className="w-full p-4 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleChange}
                      placeholder="Tell us about yourself and your teaching philosophy..."
                      rows={4}
                      className="w-full p-4 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300 backdrop-blur-sm resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <InfoCard
                    icon={<BookOpen className="w-4 h-4 text-sky-500" />}
                    label="Subject"
                    value={profile.subject || "Not added yet"}
                  />
                  <InfoCard
                    icon={<GraduationCap className="w-4 h-4 text-sky-500" />}
                    label="Qualification"
                    value={profile.qualification || "Not added yet"}
                  />
                  <InfoCard
                    icon={<MapPin className="w-4 h-4 text-sky-500" />}
                    label="Institution"
                    value={profile.college || "Not added yet"}
                  />
                  <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl p-6 border-l-4 border-sky-400 shadow-inner">
                    <p className="text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide">
                      About
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {profile.bio || "Bio not added yet"}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Section - Achievements */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-300">
                  Achievements
                </h2>
              </div>

              {isEditing && !viewOnly ? (
                <div className="space-y-3">
                  {formData.achievements.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-center group"
                    >
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleItemChange(
                            "achievements",
                            index,
                            e.target.value,
                          )
                        }
                        className="flex-1 p-3 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300"
                        placeholder="Add an achievement..."
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveItem("achievements", index)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all duration-300 shadow-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddItem("achievements")}
                    className="mt-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 font-semibold"
                  >
                    + Add Achievement
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {profile.achievements.length > 0 ? (
                    profile.achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50 hover:shadow-md transition-all duration-300"
                      >
                        <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                          {achievement}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-amber-200 to-orange-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Award className="w-6 h-6 text-amber-600" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">
                        No achievements added yet
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Skills & Interests */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {["skills", "interests"].map((field, fieldIndex) => (
              <motion.div
                key={field}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + fieldIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${field === "skills" ? "from-emerald-500 to-teal-600" : "from-pink-500 to-rose-600"} rounded-xl flex items-center justify-center shadow-md`}
                  >
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-300 capitalize">
                    {field}
                  </h2>
                </div>

                {isEditing && !viewOnly ? (
                  <div className="space-y-3">
                    {formData[field].map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-3 items-center group"
                      >
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleItemChange(field, index, e.target.value)
                          }
                          className="flex-1 p-3 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300"
                          placeholder={`Add a ${field.slice(0, -1)}...`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(field, index)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all duration-300 shadow-md"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddItem(field)}
                      className={`mt-4 bg-gradient-to-r ${field === "skills" ? "from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700" : "from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"} text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 font-semibold`}
                    >
                      + Add {field.slice(0, -1)}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {profile[field].length > 0 ? (
                      profile[field].map((item, index) => (
                        <span
                          key={index}
                          className={`px-4 py-2 bg-gradient-to-r ${field === "skills" ? "from-emerald-100 to-teal-100 text-emerald-800 dark:from-emerald-800/80 dark:to-teal-800/80 dark:text-emerald-100 border-emerald-200/50 dark:border-emerald-700/50" : "from-rose-100 to-pink-100 text-rose-800 dark:from-rose-800/80 dark:to-pink-800/80 dark:text-rose-100 border-rose-200/50 dark:border-rose-700/50"} rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border cursor-default hover:-translate-y-0.5`}
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <div className="text-center py-8 w-full">
                        <div
                          className={`w-16 h-16 bg-gradient-to-br ${field === "skills" ? "from-emerald-200 to-teal-300" : "from-rose-200 to-pink-300"} rounded-full mx-auto mb-4 flex items-center justify-center`}
                        >
                          <Star
                            className={`w-6 h-6 ${field === "skills" ? "text-emerald-600" : "text-rose-600"}`}
                          />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                          No {field} added yet
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Resume & Social Links */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Resume */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-300">
                  Resume
                </h2>
              </div>

              {isEditing && !viewOnly ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-sky-300 dark:border-sky-700 rounded-xl p-6 text-center hover:border-sky-400 transition-colors duration-300">
                    <input
                      type="file"
                      onChange={handleResumeUpload}
                      className="hidden"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="resume-upload"
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          {uploadingResume ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Upload className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <p className="text-sky-600 dark:text-sky-400 font-semibold">
                          {uploadingResume ? "Uploading..." : "Upload Resume"}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              ) : profile.resume ? (
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-700/50">
                  <a
                    href={`http://localhost:5000${profile.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span className="group-hover:underline">
                      View / Download Resume
                    </span>
                  </a>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No resume uploaded yet
                  </p>
                </div>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-sky-100/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-300">
                  Connect
                </h2>
              </div>

              {isEditing && !viewOnly ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin || ""}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full p-4 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-sky-600 dark:text-sky-400 mb-2 uppercase tracking-wide">
                      GitHub
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github || ""}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                      className="w-full p-4 border-2 border-sky-200/50 dark:border-sky-700/50 rounded-xl dark:bg-gray-700/50 dark:text-white focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {profile.linkedin && (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-md transition-all duration-300 hover:scale-105"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                        <Linkedin className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
                        LinkedIn Profile
                      </span>
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-700/30 dark:to-slate-700/30 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all duration-300 hover:scale-105"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-slate-700 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                        <Github className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 font-semibold group-hover:underline">
                        GitHub Profile
                      </span>
                    </a>
                  )}
                  {!profile.linkedin && !profile.github && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-sky-200 to-blue-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-sky-600" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400">
                        No social links added yet
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Save Button */}
          {isEditing && !viewOnly && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <button
                onClick={handleSave}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-10 py-4 rounded-full shadow-lg hover:from-green-600 hover:to-emerald-700 flex items-center gap-3 font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Save className="w-5 h-5" /> Save Changes
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Enhanced InfoCard component
const InfoCard = ({ icon, label, value }) => (
  <div className="group p-4 bg-gradient-to-r from-sky-25 to-blue-25 dark:from-sky-900/20 dark:to-blue-900/20 rounded-xl border border-sky-100/50 dark:border-sky-800/50 hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 bg-sky-100 dark:bg-sky-900/50 rounded-md group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <p className="text-sky-600 dark:text-sky-400 text-sm font-bold uppercase tracking-wide">
        {label}
      </p>
    </div>
    <p className="font-bold text-lg text-gray-800 dark:text-gray-200 group-hover:text-sky-700 dark:group-hover:text-sky-300 transition-colors duration-300">
      {value}
    </p>
  </div>
);

export default TeacherProfile;
