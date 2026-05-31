import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Clock, BookOpen, User, Zap } from "lucide-react";
import recommendationService from "../services/recommendationService";

const RecommendedCourses = ({ limit = 6, onCourseTypeChange }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [interestedCourses, setInterestedCourses] = useState(new Set());
  const [isPopular, setIsPopular] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      // First, try to fetch personalized recommendations
      const recommendedData =
        await recommendationService.getRecommendedCourses(limit);

      // If no personalized recommendations, fallback to popular courses
      if (recommendedData.length === 0) {
        console.log(
          "No personalized recommendations found. Fetching popular courses...",
        );
        const popularData =
          await recommendationService.getPopularCourses(limit);
        setCourses(popularData);
        setIsPopular(true);
        onCourseTypeChange?.(true); // Notify parent that showing popular courses
      } else {
        setCourses(recommendedData);
        setIsPopular(false);
        onCourseTypeChange?.(false); // Notify parent that showing recommended courses
      }
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
            className="surface-card h-72 "
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
          {isPopular
            ? "No courses available right now"
            : "No recommendations yet. Update your interests to see personalized courses!"}
        </p>
      </div>
    );
  }

  const getLevelInfo = (level) => {
    const levelLower = level?.toLowerCase();
    if (levelLower === "beginner")
      return {
        badge:
          "border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300",
        bar: "bg-stone-400",
      };
    if (levelLower === "intermediate")
      return {
        badge:
          "border-orange-200 dark:border-orange-900/40 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300",
        bar: "bg-orange-400",
      };
    if (levelLower === "advanced" || levelLower === "expert")
      return {
        badge:
          "border-stone-800 dark:border-white bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900",
        bar: "bg-stone-900 dark:bg-stone-100",
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

            <div className="p-5 flex flex-col flex-1">
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-stone-900 dark:text-stone-50 leading-snug mb-2 line-clamp-2">
                    {course.title}
                  </h2>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold`}
                  >
                    {course.level || "Beginner"} Level
                  </span>
                </div>
              </div>

              <p className="text-sm leading-relaxed mb-4 flex-1 body-copy line-clamp-3">
                {course.description}
              </p>

              {/* Meta */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2.5 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50">
                  <div className="p-1 rounded-md bg-white dark:bg-stone-800 shadow-sm"></div>
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
                  <div className="p-1 rounded-md bg-white dark:bg-stone-800 shadow-sm"></div>
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
                  <span>Explore</span>
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
