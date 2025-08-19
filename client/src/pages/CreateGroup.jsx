import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const CreateGroup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    memberCount: "",
    members: "",
    courseDetail: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newGroup = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      members: parseInt(formData.memberCount),
      memberNames: formData.members.split(",").map((m) => m.trim()),
      courseDetail: formData.courseDetail
    };

    const existingGroups = JSON.parse(localStorage.getItem("groups")) || [];
    localStorage.setItem("groups", JSON.stringify([...existingGroups, newGroup]));

    navigate("/groups");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-6"
        >
          <h2 className="text-3xl font-bold text-indigo-700 text-center">🚀 Create Group</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">Group Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description *</label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">No. of Members *</label>
            <input
              type="number"
              name="memberCount"
              required
              value={formData.memberCount}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Member Names (comma-separated)</label>
            <input
              type="text"
              name="members"
              placeholder="Enter team members' names"
              value={formData.members}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Course Detail</label>
            <input
              type="text"
              name="courseDetail"
              placeholder="e.g., DSA, React, Python for AI"
              value={formData.courseDetail}
              onChange={handleChange}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
          >
            Create Group
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateGroup;
