import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Award,
  Star,
  TrendingUp,
} from "lucide-react";
import HumanoidAvatar from "./HumanoidAvatar";
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

  // Tier badge — stone-based, no rainbow
  const getTierBadge = (batch) => {
    const map = {
      Diamond: "bg-stone-900 text-stone-50 border-white dark:bg-stone-100 dark:text-stone-900 dark:border-white shadow-md",
      Platinum: "bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-600",
      Gold: "bg-orange-600 text-white border-orange-500 shadow-sm shadow-orange-600/20",
      Silver: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-900/40",
      Bronze: "bg-stone-50 text-stone-600 border-stone-200 dark:bg-stone-800/60 dark:text-stone-400 dark:border-stone-700",
      Basic: "bg-stone-50 text-stone-500 border-stone-200 dark:bg-stone-800/40 dark:text-stone-500 dark:border-stone-700",
    };
    return map[batch] || map.Basic;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="surface-card h-56 " />
        ))}
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center mx-auto mb-3">
          <Award className="w-5 h-5 text-stone-400" />
        </div>
        <p className="body-copy text-sm">
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
          className="surface-card overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col"
        >
          {/* Top accent bar */}
          <div className="h-1 bg-orange-400" />

          <div className="p-5 flex flex-col flex-1">
            {/* Avatar + tier */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <HumanoidAvatar
                src={teacher.profilePicture}
                name={teacher.name}
                size={52}
                className="border border-stone-200 dark:border-stone-700 shadow-sm"
              />

            </div>

            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-50 mb-1 line-clamp-2">
              {teacher.name}
            </h3>

            {(teacher.subject || teacher.department) && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {teacher.subject && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    {teacher.subject}
                  </span>
                )}
                {teacher.department && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                    {teacher.department}
                  </span>
                )}
              </div>
            )}

            <p className="text-xs body-copy line-clamp-2 mb-3 flex-1">
              {teacher.bio || "Experienced educator"}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="surface-panel p-2.5 text-center">
                <div className="text-stone-900 dark:text-stone-50 text-sm font-bold">
                  {teacher.coursesCreated || 0}
                </div>
                <div className="text-xs body-copy">Courses</div>
              </div>
              <div className="surface-panel p-2.5 text-center">
                <div className="text-stone-900 dark:text-stone-50 text-sm font-bold">
                  {teacher.engagementScore || 0}
                </div>
                <div className="text-xs body-copy">Engagement</div>
              </div>
            </div>

            {teacher.achievements && teacher.achievements.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-semibold body-copy mb-1.5 flex items-center gap-1">
                  <Star className="w-3 h-3 text-orange-500" />
                  Achievements
                </div>
                <div className="flex flex-wrap gap-1">
                  {teacher.achievements.slice(0, 3).map((achievement, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full text-xs font-medium border border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900/40 dark:bg-orange-950/20 dark:text-orange-300"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {teacher.recommendationScore && (
              <div className="mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-xs body-copy">
                  Match:{" "}
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {parseFloat(teacher.recommendationScore).toFixed(1)}/100
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedTeachers;
