import React, { useEffect, useState } from "react";
import { FileText, Download, Clock, Zap, TrendingUp, User } from "lucide-react";
import recommendationService from "../services/recommendationService";

const RecommendedResources = ({ limit = 6 }) => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await recommendationService.getRecommendedResources(limit);
      setResources(data);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFileTypeIcon = (fileType) => {
    const icons = {
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      ppt: "🎯",
      pptx: "🎯",
      xls: "📊",
      xlsx: "📊",
      video: "🎥",
      image: "🖼️",
      default: "📁",
    };
    return icons[fileType?.toLowerCase()] || icons.default;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-purple-50 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl h-64 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
        <p className="text-gray-500 dark:text-gray-400">
          No recommended resources yet. Explore more to get personalized
          suggestions!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {resources.map((resource) => (
        <div
          key={resource._id}
          className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl border border-purple-100/50 dark:border-gray-700/50 overflow-hidden transition-all duration-300 hover:-translate-y-1"
        >
          {/* Gradient background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:translate-x-12 transition-transform duration-300"></div>

          <div className="relative p-6 h-full flex flex-col">
            {/* Icon and badges */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-lg text-lg transform group-hover:scale-110 transition-transform duration-300">
                {getFileTypeIcon(resource.fileType)}
              </div>
              <div className="flex flex-col gap-2">
                <div className="px-3 py-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full text-xs font-bold text-white shadow-lg">
                  {resource.recommendationScore &&
                    `${parseFloat(resource.recommendationScore).toFixed(0)} pts`}
                </div>
              </div>
            </div>

            {/* Title and description */}
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 flex-1">
              {resource.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 flex-1">
              {resource.description}
            </p>

            {/* Creator info */}
            {resource.teacher && (
              <div className="flex items-center gap-2 mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                {resource.teacher.profilePicture ? (
                  <img
                    src={resource.teacher.profilePicture}
                    alt={resource.teacher.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {resource.teacher.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    {resource.teacher.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Instructor
                  </p>
                </div>
              </div>
            )}

            {/* Match score with icon */}
            {resource.recommendationScore && (
              <div className="mb-4 flex items-center gap-2 p-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Interest Match:{" "}
                  <span className="text-purple-600 dark:text-purple-400">
                    {parseFloat(resource.recommendationScore).toFixed(1)}/100
                  </span>
                </span>
              </div>
            )}

            {/* Download button */}
            <a
              href={resource.fileUrl}
              download
              className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl group/btn"
            >
              <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform" />
              Download Resource
            </a>
          </div>

          {/* Bottom accent */}
          <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedResources;
