import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Zap,
  Clock,
  Users,
  Star,
  TrendingUp,
  BookOpen,
  User,
  CalendarCheck,
} from "lucide-react";
import recommendationService from "../services/recommendationService";

const RecommendedCourses = ({ limit = 6 }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interestedCourses, setInterestedCourses] = useState(new Set());

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await recommendationService.getRecommendedCourses(limit);
      setCourses(data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInterestedClick = async (courseId) => {
    try {
      if (interestedCourses.has(courseId)) {
        await recommendationService.removeInterestedCourse(courseId);
        setInterestedCourses((prev) => {
          const newSet = new Set(prev);
          newSet.delete(courseId);
          return newSet;
        });
      } else {
        await recommendationService.addInterestedCourse(courseId);
        setInterestedCourses((prev) => new Set(prev).add(courseId));
      }
    } catch (err) {
      console.error("Error updating interested course:", err);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-blue-50 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl h-80 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <Zap className="w-16 h-16 text-blue-400 mx-auto mb-4 opacity-50" />
        <p className="text-gray-500 dark:text-gray-400">
          No recommendations yet. Update your interests to see personalized
          courses!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
      {courses.map((course, index) => {
        const levelLower = course.level?.toLowerCase();
        let levelInfo = {
          bg: "from-gray-400 to-gray-500",
          text: "text-white",
          icon: "📚",
        };

        if (levelLower === "beginner") {
          levelInfo = {
            bg: "from-emerald-400 to-green-500",
            text: "text-white",
            icon: "🟢",
          };
        } else if (levelLower === "intermediate") {
          levelInfo = {
            bg: "from-amber-400 to-orange-500",
            text: "text-white",
            icon: "🟠",
          };
        } else if (levelLower === "advanced") {
          levelInfo = {
            bg: "from-red-400 to-pink-500",
            text: "text-white",
            icon: "🔴",
          };
        }

        return (
          <div
            key={course._id}
            className="group bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 rounded-3xl shadow-xl hover:shadow-2xl border border-slate-600/50 dark:border-slate-700/50 overflow-hidden transition-all duration-500 hover:scale-[1.02] flex flex-col"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Course Header Section */}
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors leading-tight mb-3">
                    {course.title}
                  </h2>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${levelInfo.bg} rounded-full shadow-lg`}
                  >
                    <span className="text-lg">{levelInfo.icon}</span>
                    <span className={`font-bold text-sm ${levelInfo.text}`}>
                      {course.level || "Beginner"} Level
                    </span>
                  </div>
                </div>
                <div className="p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 opacity-60">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-6 flex-grow flex flex-col">
              <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                {course.description}
              </p>

              {/* Course Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-4 p-3 bg-slate-600/30 dark:bg-slate-700/40 rounded-xl border border-slate-500/30">
                  <div className="p-2 bg-slate-600/50 dark:bg-slate-700/50 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <span className="font-semibold text-blue-300 text-sm">
                      Duration
                    </span>
                    <p className="text-gray-300 text-sm">
                      {course.duration || "Self-paced"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 bg-slate-600/30 dark:bg-slate-700/40 rounded-xl border border-slate-500/30">
                  <div className="p-2 bg-slate-600/50 dark:bg-slate-700/50 rounded-lg">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <span className="font-semibold text-blue-300 text-sm">
                      Instructor
                    </span>
                    <p className="text-gray-300 text-sm">
                      {course.teacher?.name || "Expert Instructor"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="flex-1 group/btn relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <BookOpen className="w-5 h-5 relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" />
                  <span className="relative z-10">Explore Course</span>
                </button>

                <button
                  onClick={() => handleInterestedClick(course._id)}
                  className={`flex-1 group/btn relative overflow-hidden text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 ${
                    interestedCourses.has(course._id)
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                      : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  <Heart
                    className="w-5 h-5 relative z-10 group-hover/btn:scale-110 transition-transform duration-300"
                    fill="currentColor"
                  />
                  <span className="relative z-10">
                    {interestedCourses.has(course._id)
                      ? "Interested"
                      : "Add Interest"}
                  </span>
                </button>
              </div>
            </div>

            {/* Card Footer Accent */}
            <div className="h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-green-500"></div>
          </div>
        );
      })}
    </div>
  );
};

export default RecommendedCourses;
