import React, { useState } from "react";
import { FileText, Download } from "lucide-react";
import Sidebar from "../components/Sidebar";

const mockResources = [
  {
    id: 1,
    name: "DSA Notes",
    description: "Comprehensive notes covering arrays, linked lists, stacks, queues, and trees.",
    type: "PDF",
    fileUrl: "#",
  },
  {
    id: 2,
    name: "OOP Cheatsheet",
    description: "Quick reference for key OOP concepts in Java & C++.",
    type: "PPT",
    fileUrl: "#",
  },
  {
    id: 3,
    name: "ML Algorithms",
    description: "Overview of supervised & unsupervised machine learning models.",
    type: "PDF",
    fileUrl: "#",
  },
  {
    id: 4,
    name: "System Design Video",
    description: "Beginner-friendly walkthrough of scalable system design principles.",
    type: "Video",
    fileUrl: "#",
  },
];

const Resource = () => {
  const [resources] = useState(mockResources);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-10">
      
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-30">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-grow ml-64 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-blue-700 dark:text-white mb-2">
              📚 Explore Learning Resources
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Access notes, guides, slides, and videos shared by educators & mentors.
            </p>
          </div>

          {/* Resource Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((res) => (
              <div
                key={res.id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-5 border-l-4 border-blue-500 hover:scale-[1.01] hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300">{res.name}</h3>
                  <FileText className="text-blue-500 w-5 h-5" />
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{res.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  📄 Type: {res.type}
                </p>
                <a
                  href={res.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resource
                </a>
              </div>
            ))}
          </div>

          {/* Note for Students */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-12">
            Want to contribute a resource? Please contact your instructor or administrator.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resource;
