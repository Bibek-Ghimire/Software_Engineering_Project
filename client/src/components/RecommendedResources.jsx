import React, { useEffect, useState } from "react";
import { FileText, Download, TrendingUp } from "lucide-react";
import HumanoidAvatar from "./HumanoidAvatar";
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
      ppt: "📊",
      pptx: "📊",
      xls: "📈",
      xlsx: "📈",
      video: "🎬",
      image: "🖼️",
      default: "📁",
    };
    return icons[fileType?.toLowerCase()] || icons.default;
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

  if (resources.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center mx-auto mb-3">
          <FileText className="w-5 h-5 text-stone-400" />
        </div>
        <p className="body-copy text-sm">
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
          className="surface-card overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col"
        >
          {/* Top accent */}
          <div className="h-1 bg-orange-400" />

          <div className="p-5 flex flex-col flex-1">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-base">
                {getFileTypeIcon(resource.fileType)}
              </div>
              {resource.recommendationScore && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 text-stone-600 dark:text-stone-400">
                  {parseFloat(resource.recommendationScore).toFixed(0)} pts
                </span>
              )}
            </div>

            <h3 className="text-sm font-semibold text-stone-900 dark:text-stone-50 mb-1.5 line-clamp-2">
              {resource.title}
            </h3>
            <p className="text-xs body-copy line-clamp-3 mb-4 flex-1">
              {resource.description}
            </p>

            {resource.teacher && (
              <div className="flex items-center gap-2.5 mb-3 p-2.5 rounded-lg bg-stone-50 dark:bg-stone-900/50 border border-stone-200 dark:border-stone-700">
                <HumanoidAvatar
                  src={resource.teacher.profilePicture}
                  name={resource.teacher.name}
                  size={28}
                  className="rounded-full border border-stone-200 dark:border-stone-700"
                />
                <div>
                  <p className="text-xs font-semibold text-stone-900 dark:text-stone-50">
                    {resource.teacher.name}
                  </p>
                  <p className="text-xs body-copy">Instructor</p>
                </div>
              </div>
            )}

            {resource.recommendationScore && (
              <div className="mb-3 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-xs body-copy">
                  Match:{" "}
                  <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {parseFloat(resource.recommendationScore).toFixed(1)}/100
                  </span>
                </span>
              </div>
            )}

            <a
              href={resource.fileUrl}
              download
              className="primary-action w-full py-2.5 gap-2 text-sm mt-auto"
            >
              <Download className="w-4 h-4" />
              Download Resource
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedResources;
