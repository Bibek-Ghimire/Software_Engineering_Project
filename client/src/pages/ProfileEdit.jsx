import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Linkedin, Github } from "lucide-react";
import { getProfile } from "../services/profileService";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    college: "",
    bio: "",
    skills: [],
    interests: [],
    photo: null,
    linkedin: "",
    github: "",
    resume: null,
  });

  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const data = await getProfile();
      if (data) setProfile(data);
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) setProfile({ ...profile, [field]: file });
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setProfile({ ...profile, skills: [...profile.skills, skillInput] });
      setSkillInput("");
    }
  };

  const handleAddInterest = () => {
    if (interestInput.trim()) {
      setProfile({
        ...profile,
        interests: [...profile.interests, interestInput],
      });
      setInterestInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("college", profile.college || "");
      formData.append("bio", profile.bio || "");
      formData.append("linkedin", profile.linkedin || "");
      formData.append("github", profile.github || "");
      formData.append("skills", JSON.stringify(profile.skills));
      formData.append("interests", JSON.stringify(profile.interests));

      if (profile.photo instanceof File)
        formData.append("photo", profile.photo);
      if (profile.resume instanceof File)
        formData.append("resume", profile.resume);

      await axios.put("http://localhost:5000/api/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/profile");
    } catch (err) {
      console.error("❌ Error updating profile:", err.response?.data || err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">✏️ Edit Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleChange}
          placeholder="Name"
          className="border p-2 w-full rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={profile.email}
          disabled
          className="border p-2 w-full bg-gray-100 rounded"
        />
        <input
          type="text"
          name="college"
          value={profile.college}
          onChange={handleChange}
          placeholder="College"
          className="border p-2 w-full rounded"
        />
        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleChange}
          placeholder="Short Bio"
          className="border p-2 w-full rounded"
        />

        {/* Skills */}
        <div>
          <label>Skills</label>
          <div className="flex">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add Skill"
              className="border p-2 flex-1 rounded"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {profile.skills.map((s, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-200 rounded flex items-center gap-1"
              >
                {s}
                <button
                  type="button"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      skills: profile.skills.filter((_, idx) => idx !== i),
                    })
                  }
                  className="text-red-500 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label>Interests</label>
          <div className="flex">
            <input
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              placeholder="Add Interest"
              className="border p-2 flex-1 rounded"
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="ml-2 px-3 py-1 bg-green-500 text-white rounded"
            >
              Add
            </button>
          </div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {profile.interests.map((i, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-200 rounded flex items-center gap-1"
              >
                {i}
                <button
                  type="button"
                  onClick={() =>
                    setProfile({
                      ...profile,
                      interests: profile.interests.filter(
                        (_, index) => index !== idx,
                      ),
                    })
                  }
                  className="text-red-500 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center border rounded p-2">
          <Linkedin className="text-blue-600 w-5 h-5 mr-2" />
          <input
            type="text"
            name="linkedin"
            value={profile.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn URL"
            className="flex-1 outline-none bg-transparent"
          />
        </div>

        <div className="flex items-center border rounded p-2">
          <Github className="text-gray-800 w-5 h-5 mr-2" />
          <input
            type="text"
            name="github"
            value={profile.github}
            onChange={handleChange}
            placeholder="GitHub URL"
            className="flex-1 outline-none bg-transparent"
          />
        </div>

        <div>
          <label>Profile Photo</label>
          <input
            type="file"
            onChange={(e) => handleFileUpload(e, "photo")}
          />
        </div>

        <div>
          <label>Resume</label>
          <input
            type="file"
            onChange={(e) => handleFileUpload(e, "resume")}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;
