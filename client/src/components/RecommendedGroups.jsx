import React, { useEffect, useState } from "react";
import { Users, Plus, UserPlus, TrendingUp } from "lucide-react";
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
          <div
            key={i}
            className="bg-gradient-to-br from-green-50 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl h-64 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-green-400 mx-auto mb-4 opacity-50" />
        <p className="text-gray-500 dark:text-gray-400">
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
          className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-green-100/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:-translate-y-1"
        >
          {/* Gradient background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:translate-x-12 transition-transform duration-300"></div>

          <div className="relative p-6 h-full flex flex-col">
            {/* Icon, member count, and match score */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full text-xs font-bold text-white shadow-lg">
                  {group.memberCount || 0} members
                </div>
                {group.recommendationScore && (
                  <div className="px-3 py-1 bg-gradient-to-r from-teal-400 to-green-400 rounded-full text-xs font-bold text-white shadow-lg flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {parseFloat(group.recommendationScore).toFixed(0)}%
                  </div>
                )}
              </div>
            </div>

            {/* Title and description */}
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 flex-1">
              {group.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
              {group.description}
            </p>

            {/* Member avatars */}
            {group.members && group.members.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-2">
                  {group.members.slice(0, 3).map((member, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-800 shadow-md"
                      title={typeof member === "string" ? member : member.name}
                    >
                      {typeof member === "string"
                        ? member.charAt(0).toUpperCase()
                        : member.name?.charAt(0).toUpperCase()}
                    </div>
                  ))}
                </div>
                {group.members.length > 3 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    +{group.members.length - 3} more
                  </span>
                )}
              </div>
            )}

            {/* Join button */}
            <button className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl group/btn">
              <UserPlus className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
              Join Group
            </button>
          </div>

          {/* Bottom accent */}
          <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedGroups;
