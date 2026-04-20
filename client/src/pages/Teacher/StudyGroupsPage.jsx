// src/pages/StudyGroupsPage.jsx
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Users, Trash2, Pencil, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

const StudyGroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/groups", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleDeleteGroup = async (id) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/groups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGroups();
    } catch (err) {
      console.error(err);
      alert("Error deleting group");
    }
  };

  const handleJoinGroup = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/groups/join/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchGroups();
      alert("Joined successfully!");
    } catch (err) {
      console.error(err);
      alert("Error joining group");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading groups...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-gray-950 p-8 text-gray-800 dark:text-white transition-colors duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-500" /> Study Groups
        </h2>

        {/* Create Group Link */}
        {user?.role === "teacher" && (
          <Link
            to="/creategroup"
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl transition"
          >
            <Pencil className="w-4 h-4" /> Create Group
          </Link>
        )}
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group._id}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:scale-105"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              {group.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-300 mt-1">
              Members: {group.members?.length || 0}
            </p>

            <div className="flex gap-3 mt-4">
              {/* Teacher options */}
              {user?.role === "teacher" && group.teacher === user.id && (
                <>
                  <Link
                    to={`/edit-group/${group._id}`}
                    className="text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteGroup(group._id)}
                    className="text-red-500 hover:underline flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </>
              )}

              {/* Student options */}
              {user?.role === "student" &&
                !group.members?.includes(user.id) && (
                  <button
                    onClick={() => handleJoinGroup(group._id)}
                    className="text-green-500 hover:underline flex items-center gap-1"
                  >
                    <UserPlus className="w-4 h-4" /> Join
                  </button>
                )}

              {user?.role === "student" && group.members?.includes(user.id) && (
                <span className="text-gray-400 italic">Joined</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyGroupsPage;
