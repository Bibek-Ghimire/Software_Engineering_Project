import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const LeaderBoard = () => {
  // Example static teacher data — replace with your backend/API data later
  const [teachers, setTeachers] = useState([
    { id: 1, name: "Alice Johnson", score: 95 },
    { id: 2, name: "Bob Smith", score: 89 },
    { id: 3, name: "Carol Lee", score: 83 },
    { id: 4, name: "David Kim", score: 77 },
    { id: 5, name: "Eva Brown", score: 72 },
  ]);

  // Sort teachers descending by score just in case
  useEffect(() => {
    setTeachers((prev) =>
      [...prev].sort((a, b) => b.score - a.score)
    );
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-blue-50 dark:bg-slate-900 p-6">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-white mb-6">
            🏆 Teacher Leaderboard
          </h1>
          <ol className="list-decimal list-inside space-y-4 text-gray-700 dark:text-gray-300">
            {teachers.map((teacher, idx) => (
              <li
                key={teacher.id}
                className="flex justify-between items-center bg-blue-100 dark:bg-blue-900 rounded-lg p-4 shadow-sm"
              >
                <span className="font-semibold text-lg">{teacher.name}</span>
                <span className="text-xl font-bold text-blue-700 dark:text-blue-300">
                  {teacher.score}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
};

export default LeaderBoard;
