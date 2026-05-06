import React, { useEffect, useState } from "react";
import { Users, UserPlus, TrendingUp } from "lucide-react";
import HumanoidAvatar from "./HumanoidAvatar";
import recommendationService from "../services/recommendationService";

const RecommendedGroups = ({ limit = 6 }) => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await recommendationService.getRecommendedGroups(limit);
      setGroups(data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="surface-card h-56 animate-pulse" />
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center mx-auto mb-3">
          <Users className="w-5 h-5 text-stone-400" />
        </div>
        <p className="body-copy text-sm">
          No recommended groups yet. Join groups related to your interests!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group) => (
        <div
          key={group._id}
          className="surface-card overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col"
        >
          {/* Top accent */}
          <div className="h-1 bg-orange-400" />

          <div className="p-5 flex flex-col flex-1">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center">
                <Users className="w-5 h-5 text-stone-500 dark:text-stone-400" />
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400">
                  {group.memberCount || 0} members
                </span>
                {group.recommendationScore && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold border border-orange-200 dark:border-orange-900/40 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {parseFloat(group.recommendationScore).toFixed(0)}% match
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-50 mb-1.5 line-clamp-2">
              {group.name}
            </h3>
            <p className="text-xs body-copy line-clamp-3 mb-4 flex-1">
              {group.description}
            </p>

            {group.members && group.members.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-2">
                  {group.members.slice(0, 3).map((member, idx) => (
                    <div
                      key={idx}
                      title={typeof member === "string" ? member : member.name}
                    >
                      <HumanoidAvatar
                        src={
                          typeof member === "object"
                            ? member.profilePicture
                            : null
                        }
                        name={typeof member === "string" ? member : member.name}
                        size={28}
                        className="border-2 border-white dark:border-stone-900 shadow-sm"
                      />
                    </div>
                  ))}
                </div>
                {group.members.length > 3 && (
                  <span className="text-xs body-copy font-medium">
                    +{group.members.length - 3} more
                  </span>
                )}
              </div>
            )}

            <button className="primary-action w-full py-2.5 gap-2 text-sm">
              <UserPlus className="w-4 h-4" />
              Join Group
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedGroups;
