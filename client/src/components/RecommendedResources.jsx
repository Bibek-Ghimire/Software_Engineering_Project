import React, { useEffect, useState } from "react";
import { FileText, Download, Eye, TrendingUp } from "lucide-react";
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
      pdf: "",
      doc: "",
      docx: "",
      ppt: "",
      pptx: "",
      xls: "",
      xlsx: "",
      image: "",
      default: "",
    };
    return icons[fileType?.toLowerCase()] || icons.default;
  };

  const handleView = (url) => {
    if (!url) return;
    window.open(`http://localhost:5000${url}`, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="surface-card h-56 "
          />
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-10">
        
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

          <div className="p-5 flex flex-col flex-1">
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              {getFileTypeIcon(resource.fileType)}
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
                  // src={resource.teacher.profilePicture}
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
              <div className="mb-3 flex items-center gap-1.5"></div>
            )}

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button
                type="button"
                onClick={() => handleView(resource.fileUrl)}
                className="bg-blue-500 text-white py-2.5 gap-2 text-sm rounded-xl flex items-center justify-center"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <a
                href={`http://localhost:5000${resource.fileUrl}`}
                download
                className="primary-action py-2.5 gap-2 text-sm rounded-xl flex items-center justify-center"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecommendedResources;
