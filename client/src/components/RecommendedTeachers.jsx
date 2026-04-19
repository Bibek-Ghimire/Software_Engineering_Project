import React, { useEffect, useState } from "react";
import {
  Users,
  MessageSquare,
  Award,
  BookOpen,
  Star,
  TrendingUp,
} from "lucide-react";
import recommendationService from "../services/recommendationService";

const RecommendedTeachers = ({ limit = 6 }) => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await recommendationService.getRecommendedTeachers(limit);
      setTeachers(data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (batch) => {
    const colors = {
      Platinum: "from-purple-500 to-pink-500",
      Diamond: "from-blue-500 to-cyan-500",
      Gold: "from-amber-500 to-orange-500",
      Silver: "from-gray-500 to-slate-500",
      Bronze: "from-orange-700 to-amber-700",
      Basic: "from-gray-400 to-gray-600",
    };
    return colors[batch] || colors.Basic;
  };

  const getTierBadgeColor = (batch) => {
    const colors = {
      Platinum: "bg-gradient-to-r from-purple-400 to-pink-400",
      Diamond: "bg-gradient-to-r from-blue-400 to-cyan-400",
      Gold: "bg-gradient-to-r from-amber-400 to-orange-400",
      Silver: "bg-gradient-to-r from-gray-400 to-slate-400",
      Bronze: "bg-gradient-to-r from-orange-600 to-amber-600",
      Basic: "bg-gradient-to-r from-gray-400 to-gray-500",
    };
    return colors[batch] || colors.Basic;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-indigo-50 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl h-64 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="w-16 h-16 text-indigo-400 mx-auto mb-4 opacity-50" />
        <p className="text-gray-500 dark:text-gray-400">
          No recommended teachers yet. Update your interests to see expert
          instructors!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {teachers.map((teacher) => (
        <div
          key={teacher._id}
          className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-indigo-100/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:-translate-y-1"
        >
          {/* Gradient background accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:translate-x-12 transition-transform duration-300"></div>

          <div className="relative p-6 h-full flex flex-col">
            {/* Top section with avatar and tier */}
            <div className="flex items-start justify-between gap-3 mb-4">
              {/* Avatar */}
              <div className="relative">
                {teacher.profilePicture ? (
                  <img
                    src={teacher.profilePicture}
                    alt={teacher.name}
                    className="w-16 h-16 rounded-full border-3 border-indigo-500/30 object-cover shadow-lg"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold border-3 border-indigo-500/30 shadow-lg">
                    {teacher.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Tier badge */}
              <div
                className={`flex-shrink-0 px-3 py-1 ${getTierBadgeColor(teacher.batch)} rounded-full text-xs font-bold text-white shadow-lg`}
              >
                {teacher.batch || "Basic"}
              </div>
            </div>

            {/* Teacher info */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-2">
              {teacher.name}
            </h3>

            {/* Subject and department */}
            {(teacher.subject || teacher.department) && (
              <div className="flex flex-wrap gap-2 mb-3">
                {teacher.subject && (
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full">
                    {teacher.subject}
                  </span>
                )}
                {teacher.department && (
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
                    {teacher.department}
                  </span>
                )}
              </div>
            )}

            {/* Bio */}
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
              {teacher.bio || "Experienced educator"}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 text-center">
                <div className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">
                  {teacher.coursesCreated || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Courses
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                <div className="text-purple-600 dark:text-purple-400 text-sm font-bold">
                  {teacher.engagementScore || 0}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Engagement
                </div>
              </div>
            </div>

            {/* Achievements */}
            {teacher.achievements && teacher.achievements.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500" />
                  Achievements
                </div>
                <div className="flex flex-wrap gap-1">
                  {teacher.achievements.slice(0, 3).map((achievement, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation score */}
            {teacher.recommendationScore && (
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Match Score:{" "}
                  <span className="text-indigo-600 dark:text-indigo-400">
                    {parseFloat(teacher.recommendationScore).toFixed(1)}/100
                  </span>
                </span>
              </div>
            )}

            {/* Contact button */}
            <button className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl group/btn">
              <MessageSquare className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              Contact Teacher
            </button>
          </div>

          {/* Bottom accent */}
          <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedTeachers;
