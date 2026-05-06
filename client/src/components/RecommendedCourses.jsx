import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Clock,
  BookOpen,
  User,
  Zap,
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="surface-card h-72 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center mx-auto mb-4">
          <Zap className="w-6 h-6 text-stone-400" />
        </div>
        <p className="body-copy text-sm">
          No recommendations yet. Update your interests to see personalized
          courses!
        </p>
      </div>
    );
  }

  const getLevelInfo = (level) => {
    const levelLower = level?.toLowerCase();
    if (levelLower === "beginner")
      return {
        badge:
          "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300",
        bar: "bg-emerald-400",
      };
    if (levelLower === "intermediate")
      return {
        badge:
          "border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300",
        bar: "bg-amber-400",
      };
    if (levelLower === "advanced")
      return {
        badge:
          "border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300",
        bar: "bg-rose-400",
      };
    return {
      badge:
        "border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300",
      bar: "bg-stone-300",
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
      {courses.map((course, index) => {
        const levelInfo = getLevelInfo(course.level);
        return (
          <div
            key={course._id}
            className="surface-card overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Level bar */}
            <div className={`h-1 ${levelInfo.bar}`} />

            <div className="p-5 flex flex-col flex-1">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-stone-900 dark:text-stone-50 leading-snug mb-2 line-clamp-2">
                    {course.title}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${levelInfo.badge}`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                    {course.level || "Beginner"} Level
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shrink-0">
                  <BookOpen className="w-4 h-4 text-stone-500 dark:text-stone-400" />
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-4 flex-1 body-copy line-clamp-3">
                {course.description}
              </p>

              {/* Meta */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
                  <div className="p-1 rounded-md bg-white dark:bg-stone-800 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
                      Duration
                    </span>
                    <p className="text-xs text-stone-700 dark:text-stone-200">
                      {course.duration || "Self-paced"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
                  <div className="p-1 rounded-md bg-white dark:bg-stone-800 shadow-sm">
                    <User className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500">
                      Instructor
                    </span>
                    <p className="text-xs text-stone-700 dark:text-stone-200">
                      {course.teacher?.name || "Expert Instructor"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2.5 mt-auto">
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="flex-1 primary-action py-2.5 gap-2 text-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Explore</span>
                </button>

                <button
                  onClick={() => handleInterestedClick(course._id)}
                  className={`flex-1 py-2.5 gap-2 text-sm btn-base border rounded-lg px-4 transition-all ${
                    interestedCourses.has(course._id)
                      ? "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700"
                      : "bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800"
                  }`}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={interestedCourses.has(course._id) ? "currentColor" : "none"}
                  />
                  <span>
                    {interestedCourses.has(course._id)
                      ? "Interested"
                      : "Interest"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecommendedCourses;
