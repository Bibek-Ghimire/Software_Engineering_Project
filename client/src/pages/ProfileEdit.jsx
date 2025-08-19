import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const storedProfile = JSON.parse(localStorage.getItem("syncademy_profile"));

  const [name, setName] = useState(storedProfile?.name || "");
  const [email, setEmail] = useState(storedProfile?.email || "");
  const [college, setCollege] = useState(storedProfile?.college || "");
  const [bio, setBio] = useState(storedProfile?.bio || "");
  const [skills, setSkills] = useState(storedProfile?.skills || []);
  const [skillInput, setSkillInput] = useState("");

  const [interests, setInterests] = useState(storedProfile?.interests || []);
  const [interestInput, setInterestInput] = useState("");

  const [photo, setPhoto] = useState(storedProfile?.photo || "");
  const [linkedin, setLinkedin] = useState(storedProfile?.linkedin || "");
  const [github, setGithub] = useState(storedProfile?.github || "");
  const [resumeFile, setResumeFile] = useState(storedProfile?.resume || null);

  // Upload handlers
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) return alert("Upload a valid image.");
    const reader = new FileReader();
    reader.onloadend = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file?.type !== "application/pdf") return alert("Upload a PDF file.");
    const reader = new FileReader();
    reader.onloadend = () => setResumeFile(reader.result);
    reader.readAsDataURL(file);
  };

  // Add/remove skills/interests
  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };
  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput("");
    }
  };
  const removeInterest = (interest) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProfile = {
      name,
      email,
      college,
      bio,
      skills,
      interests,
      photo,
      linkedin,
      github,
      resume: resumeFile,
    };
    localStorage.setItem("syncademy_profile", JSON.stringify(updatedProfile));
    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-3xl p-8 max-w-xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">Edit Profile</h2>

        {/* Profile Photo */}
        <div className="mb-6 text-center">
          {photo ? (
            <img src={photo} alt="Profile" className="w-24 h-24 mx-auto rounded-full border-4 border-blue-500 mb-2 object-cover" />
          ) : (
            <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold text-xl mb-2">
              ?
            </div>
          )}
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>

        {/* Name */}
        <label className="block mb-4">
          <span className="font-semibold text-gray-700">Name</span>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded-md border-gray-300 focus:ring-blue-300 focus:outline-none"
          />
        </label>

        {/* Email (disabled) */}
        <label className="block mb-4">
          <span className="font-semibold text-gray-700">Email</span>
          <input
            type="email"
            value={email}
            disabled
            className="mt-1 w-full border px-3 py-2 rounded-md bg-gray-100 text-gray-500"
          />
        </label>

        {/* College */}
        <label className="block mb-4">
          <span className="font-semibold text-gray-700">College</span>
          <input
            type="text"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded-md border-gray-300 focus:ring-blue-300 focus:outline-none"
          />
        </label>

        {/* Bio */}
        <label className="block mb-4">
          <span className="font-semibold text-gray-700">Bio</span>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded-md border-gray-300 focus:ring-blue-300 focus:outline-none"
          />
        </label>

        {/* Skills */}
        <div className="mb-4">
          <label className="font-semibold text-gray-700">Skills</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add a skill"
              className="flex-grow border px-3 py-2 rounded-md border-gray-300 focus:ring-blue-300 focus:outline-none"
            />
            <button
              type="button"
              onClick={addSkill}
              className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
            >
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ✖
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div className="mb-4">
          <label className="font-semibold text-gray-700">Interests</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              placeholder="Add an interest"
              className="flex-grow border px-3 py-2 rounded-md border-gray-300 focus:ring-blue-300 focus:outline-none"
            />
            <button
              type="button"
              onClick={addInterest}
              className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
            >
              +
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {interests.map((interest, idx) => (
              <span key={idx} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                {interest}
                <button
                  type="button"
                  onClick={() => removeInterest(interest)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ✖
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* LinkedIn */}
        <label className="block mb-4">
          <span className="font-semibold text-gray-700">LinkedIn</span>
          <input
            type="url"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded-md border-gray-300 focus:ring-blue-300 focus:outline-none"
            placeholder="https://linkedin.com/in/your-profile"
          />
        </label>

        {/* GitHub */}
        <label className="block mb-4">
          <span className="font-semibold text-gray-700">GitHub</span>
          <input
            type="url"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            className="mt-1 w-full border px-3 py-2 rounded-md border-gray-300 focus:ring-blue-300 focus:outline-none"
            placeholder="https://github.com/your-username"
          />
        </label>

        {/* Resume */}
        <label className="block mb-6">
          <span className="font-semibold text-gray-700">Upload Resume (PDF)</span>
          <input type="file" accept=".pdf" onChange={handleResumeChange} className="mt-1 block w-full" />
          {resumeFile && <p className="mt-1 text-sm text-green-600">Resume uploaded ✔</p>}
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
