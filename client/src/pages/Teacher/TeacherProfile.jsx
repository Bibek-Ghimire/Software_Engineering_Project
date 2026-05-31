// src/pages/TeacherProfile.jsx
import React, { useEffect, useState, useMemo } from "react";
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
  Sun,
  Moon,
} from "lucide-react";
import axios from "axios";
import TeacherSidebar from "../../components/TeacherSidebar";
import { useLocation } from "react-router-dom";

const TeacherProfile = () => {
  const token = sessionStorage.getItem("token");
  const location = useLocation();
  const viewOnly = location.state?.viewOnly || false; // <-- viewOnly flag

  const initialProfile = useMemo(
    () => ({
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
    }),
    [],
  );

  const [profile, setProfile] = useState(initialProfile);
  const [formData, setFormData] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

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
  }, [token, initialProfile]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

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
      <div className="flex justify-center items-center min-h-screen bg-stone-50 dark:bg-stone-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-base font-semibold text-stone-700 dark:text-stone-300 ">
            Loading profile...
          </p>
        </div>
      </div>
    );

  // ---------------- UI ----------------
  return (
    <div className="flex min-h-screen page-surface transition-all duration-700">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <TeacherSidebar />
      </div>
      <div className="ml-72 min-h-screen page-surface w-full relative">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-8 right-8 p-4 rounded-2xl bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm text-orange-600 dark:text-orange-400 shadow-xl hover:shadow-2xl hover:scale-110 border-2 border-stone-200/50 dark:border-stone-700/50 transition-all duration-300 z-10 group"
        >
          {darkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
        {/* Decorative background elements */}

        <motion.div
          className="max-w-6xl mx-auto bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-orange-50/50 dark:border-stone-700/50 relative z-10"
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
                    className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl ring-4 ring-stone-200/50 dark:ring-stone-800/50"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-orange-500 flex items-center justify-center text-white text-4xl font-bold shadow-2xl ring-4 ring-stone-200/50 dark:ring-stone-800/50">
                    {profile.name ? profile.name[0] : "T"}
                  </div>
                )}
              </motion.div>
              {isEditing && !viewOnly && (
                <label className="absolute bottom-2 right-2 bg-stone-800 p-3 rounded-full cursor-pointer hover:bg-stone-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 border-2 border-white dark:border-stone-700">
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
              <h1 className="text-4xl font-bold brand-title text-stone-900 dark:text-stone-50 mb-3 flex items-center justify-center md:justify-start gap-3">
                <div className="w-8 h-8 bg-stone-800 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                {profile.name}
              </h1>
              <div className="space-y-2">
                <p className="text-stone-600 dark:text-stone-400 flex items-center justify-center md:justify-start gap-2 text-lg font-medium">
                  <Mail className="w-4 h-4" /> {profile.email}
                </p>
                <p className="text-stone-600 dark:text-stone-400 flex items-center justify-center md:justify-start gap-2">
                  <GraduationCap className="w-4 h-4" />
                  {profile.qualification || "Qualification not added yet"}
                </p>
                <p className="text-stone-500 dark:text-stone-400 flex items-center justify-center md:justify-start gap-2">
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
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-stone-800 text-white hover:bg-stone-900"
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
              className="surface-card p-8 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-stone-800 rounded-xl flex items-center justify-center shadow-md">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-stone-700 dark:text-stone-300">
                  Teaching Information
                </h2>
              </div>

              {isEditing && !viewOnly ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2 uppercase tracking-wide">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject || ""}
                      onChange={handleChange}
                      placeholder="What subject do you teach?"
                      className="w-full p-4 border-2 border-stone-200 dark:border-stone-700 rounded-xl dark:bg-stone-700/50 dark:text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2 uppercase tracking-wide">
                      Qualification
                    </label>
                    <input
                      type="text"
                      name="qualification"
                      value={formData.qualification || ""}
                      onChange={handleChange}
                      placeholder="Your highest qualification"
                      className="w-full p-4 border-2 border-stone-200 dark:border-stone-700 rounded-xl dark:bg-stone-700/50 dark:text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2 uppercase tracking-wide">
                      Institution
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college || ""}
                      onChange={handleChange}
                      placeholder="Your institution/college"
                      className="w-full p-4 border-2 border-stone-200 dark:border-stone-700 rounded-xl dark:bg-stone-700/50 dark:text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2 uppercase tracking-wide">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleChange}
                      placeholder="Tell us about yourself and your teaching philosophy..."
                      rows={4}
                      className="w-full p-4 border-2 border-stone-200 dark:border-stone-700 rounded-xl dark:bg-stone-700/50 dark:text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300 backdrop-blur-sm resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <InfoCard
                    icon={<BookOpen className="w-4 h-4 text-orange-500" />}
                    label="Subject"
                    value={profile.subject || "Not added yet"}
                  />
                  <InfoCard
                    icon={<GraduationCap className="w-4 h-4 text-orange-500" />}
                    label="Qualification"
                    value={profile.qualification || "Not added yet"}
                  />
                  <InfoCard
                    icon={<MapPin className="w-4 h-4 text-orange-500" />}
                    label="Institution"
                    value={profile.college || "Not added yet"}
                  />
                  <div className="bg-stone-100 dark:bg-stone-800 rounded-xl p-6 border-l-4 border-orange-400 shadow-inner">
                    <p className="text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2 uppercase tracking-wide">
                      About
                    </p>
                    <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                      {profile.bio || "Bio not added yet"}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Section - Achievements */}
            <motion.div
              className="surface-card p-8 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-md">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-stone-700 dark:text-stone-300">
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
                        className="flex-1 p-3 border-2 border-stone-200 dark:border-stone-700 rounded-xl dark:bg-stone-700/50 dark:text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300"
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
                    className="mt-4 bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 font-semibold"
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
                        className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-700/50 hover:shadow-md transition-all duration-300"
                      >
                        <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                        <p className="text-stone-700 dark:text-stone-300 font-medium">
                          {achievement}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-amber-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Award className="w-6 h-6 text-amber-600" />
                      </div>
                      <p className="text-stone-500 dark:text-stone-400">
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
                className="surface-card p-8 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + fieldIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`w-10 h-10 ${field === "skills" ? "bg-emerald-500" : "bg-pink-500"} rounded-xl flex items-center justify-center shadow-md`}
                  >
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-stone-700 dark:text-stone-300 capitalize">
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
                          className="flex-1 p-3 border-2 border-stone-200 dark:border-stone-700 rounded-xl dark:bg-stone-700/50 dark:text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300"
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
                      className={`mt-4 ${field === "skills" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-pink-500 hover:bg-pink-600"} text-white px-6 py-3 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 font-semibold`}
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
                          className={`px-4 py-2  ${field === "skills" ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/40" : "bg-rose-50 text-rose-800 dark:bg-rose-950/20 dark:text-rose-300 border-rose-200 dark:border-rose-900/40"} rounded-xl text-sm font-semibold border cursor-default`}
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <div className="text-center py-8 w-full">
                        <div
                          className={`w-16 h-16 ${field === "skills" ? "bg-emerald-200" : "bg-rose-200"} rounded-full mx-auto mb-4 flex items-center justify-center`}
                        >
                          <Star
                            className={`w-6 h-6 ${field === "skills" ? "text-emerald-600" : "text-rose-600"}`}
                          />
                        </div>
                        <p className="text-stone-500 dark:text-stone-400">
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
              className="surface-card p-8 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-stone-700 dark:text-stone-300">
                  Resume
                </h2>
              </div>

              {isEditing && !viewOnly ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-xl p-6 text-center hover:border-orange-400 transition-colors duration-300">
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
                        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                          {uploadingResume ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Upload className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <p className="text-stone-600 dark:text-stone-400 font-semibold">
                          {uploadingResume ? "Uploading..." : "Upload Resume"}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              ) : profile.resume ? (
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-xl p-6 border border-indigo-200/50 dark:border-indigo-700/50">
                  <a
                    href={`http://localhost:5000${profile.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <span className="group-hover:underline">
                      View / Download Resume
                    </span>
                  </a>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-indigo-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-stone-500 dark:text-stone-400">
                    No resume uploaded yet
                  </p>
                </div>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="surface-card p-8 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-stone-800 rounded-xl flex items-center justify-center shadow-md">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-stone-700 dark:text-stone-300">
                  Connect
                </h2>
              </div>

              {isEditing && !viewOnly ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2 uppercase tracking-wide">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin || ""}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full p-4 border-2 border-stone-200 dark:border-stone-700 rounded-xl dark:bg-stone-700/50 dark:text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300 backdrop-blur-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-stone-600 dark:text-stone-400 mb-2 uppercase tracking-wide">
                      GitHub
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github || ""}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                      className="w-full p-4 border-2 border-stone-200 dark:border-stone-700 rounded-xl dark:bg-stone-700/50 dark:text-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/20 transition-all duration-300 backdrop-blur-sm"
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
                      className="group flex items-center gap-3 p-4 bg-blue-50 dark:bg-stone-800/50 rounded-xl border border-stone-200/50 dark:border-blue-700/50 hover:shadow-md transition-all duration-300 hover:scale-105"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Linkedin className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-orange-600 dark:text-orange-400 font-semibold group-hover:underline">
                        LinkedIn Profile
                      </span>
                    </a>
                  )}
                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-3 p-4 surface-panel rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105"
                    >
                      <div className="w-8 h-8 bg-stone-800 dark:bg-stone-700 rounded-lg flex items-center justify-center">
                        <Github className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-stone-700 dark:text-stone-300 font-semibold group-hover:underline">
                        GitHub Profile
                      </span>
                    </a>
                  )}
                  {!profile.linkedin && !profile.github && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-stone-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-stone-500 dark:text-stone-400" />
                      </div>
                      <p className="text-stone-500 dark:text-stone-400">
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
                className="bg-green-500 text-white px-10 py-4 rounded-full shadow-lg hover:bg-green-600 flex items-center gap-3 font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
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
  <div className="group p-4 bg-stone-100 dark:bg-stone-900/20 rounded-xl border border-orange-50/50 dark:border-stone-800/50 hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-2 mb-2">
      <div className="p-1.5 bg-orange-50 dark:bg-stone-900/50 rounded-md group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <p className="text-stone-600 dark:text-stone-400 text-sm font-bold uppercase tracking-wide">
        {label}
      </p>
    </div>
    <p className="font-bold text-lg text-stone-800 dark:text-stone-200 group-hover:text-stone-700 dark:group-hover:text-stone-300 transition-colors duration-300">
      {value}
    </p>
  </div>
);

export default TeacherProfile;
