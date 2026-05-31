import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import {
  getMyBatch,
  getMyBatchMembers,
  getMyBatchSimilarUsers,
} from "../services/batchService.js";
import HumanoidAvatar from "../components/HumanoidAvatar";

/**
 * Format algorithm name for display
 */
const formatAlgorithmName = (algo) => {
  const algorithmNames = {
    kmeans: "K-Means Clustering",
    hierarchical: "Hierarchical Agglomerative Clustering (HAC)",
    spectral: "Spectral Clustering",
    dbscan: "DBSCAN Clustering",
    greedy: "Greedy Interest-Based Clustering",
  };
  return algorithmNames[algo?.toLowerCase()] || algo || "Unknown";
};

/**
 * Get algorithm description
 */
const getAlgorithmDescription = (algo) => {
  const descriptions = {
    kmeans:
      "K-Means partitions students into k clusters by minimizing within-cluster variance, creating balanced, distinct groups.",
    hierarchical:
      "Hierarchical Agglomerative Clustering builds a tree of clusters, merging similar students bottom-up for natural groupings.",
    spectral:
      "Spectral Clustering uses graph theory to identify connected components of students with similar interests.",
    dbscan:
      "DBSCAN groups students based on density, handling outliers and creating clusters of varying sizes naturally.",
    greedy:
      "Greedy Interest-Based Clustering sequentially assigns students to batches that best match their learning interests.",
  };
  return (
    descriptions[algo?.toLowerCase()] ||
    "Advanced clustering algorithm for batch allocation"
  );
};

/**
 * STUDY BATCH PAGE
 * Displays the current user's batch information
 * Users can only see their own batch and members
 */
export default function StudyBatchPage() {
  const { user } = useAuth();
  const [batch, setBatch] = useState(null);
  const [members, setMembers] = useState([]);
  const [similarUsers, setSimilarUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch batch information
        const batchResponse = await getMyBatch();
        if (batchResponse.success) {
          setBatch(batchResponse.data);
        }

        // Fetch batch members
        const membersResponse = await getMyBatchMembers();
        if (membersResponse.success) {
          setMembers(membersResponse.data);
        }

        // Fetch similar users in batch
        const similarResponse = await getMyBatchSimilarUsers();
        if (similarResponse.success) {
          setSimilarUsers(similarResponse.data);
        }
      } catch (err) {
        setError(
          err.message ||
            "Failed to load batch information. You may not be assigned to a batch yet.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBatchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen page-surface p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-700 dark:border-stone-200"></div>
            </div>
            <p className="mt-4 body-copy">Loading batch information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen page-surface p-6">
        <div className="max-w-6xl mx-auto">
          <div className="surface-card p-6 border-rose-200 dark:border-rose-900/40">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">
              No Batch Assigned
            </h2>
            <p className="body-copy">{error}</p>
            <p className="text-sm body-copy mt-3">
              Please complete your profile with interests and skills to be
              assigned to a batch.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen page-surface p-6">
        <div className="max-w-6xl mx-auto">
          <div className="surface-card p-6 border-amber-200 dark:border-amber-900/40">
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
              Batch Information Not Available
            </h2>
            <p className="body-copy mt-2">
              Please contact an administrator for batch assignment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-surface p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="section-title text-3xl">My Study Batch</h1>
          <p className="body-copy mt-1">
            Connect with students who share your interests
          </p>
        </div>

        {/* Batch Header Card */}
        <div className="surface-card p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-2">
                {batch.name}
              </h2>
              <p className="body-copy mb-4">
                {batch.memberCount} of {batch.maxSize} members
              </p>
              <div className="w-full max-w-xs bg-stone-200 dark:bg-stone-800 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-orange-500 h-full transition-all duration-300"
                  style={{ width: `${batch.fillPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm body-copy mt-2">
                {batch.fillPercentage}% full
              </p>
            </div>
            <div className="surface-panel p-4 text-center">
              <p className="text-sm body-copy">Batch ID</p>
              <p className="font-mono text-sm text-stone-900 dark:text-stone-50 break-all">
                {batch._id}
              </p>
            </div>
          </div>

          {/* Dominant Interests */}
          {batch.dominantInterests && batch.dominantInterests.length > 0 && (
            <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-700">
              <p className="text-sm font-semibold body-copy mb-3">
                Key Interests in Batch
              </p>
              <div className="flex flex-wrap gap-2">
                {batch.dominantInterests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="control-pill rounded-full bg-orange-100 text-orange-700 border border-orange-200 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-900/40"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Batch Allocation Algorithm Info */}
          {batch.allocationAlgorithm && (
            <div className="mt-6 pt-6 border-t border-stone-200 dark:border-stone-700">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border border-purple-200 dark:border-purple-900/40 rounded-lg p-5">
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                    <div className="w-10 h-10 rounded-full bg-purple-200 dark:bg-purple-900/40 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-600 dark:text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3 mb-3 flex-wrap">
                      <h3 className="font-bold text-purple-900 dark:text-purple-100 text-lg">
                        {formatAlgorithmName(batch.allocationAlgorithm)}
                      </h3>
                      {batch.allocationScore > 0 && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold bg-gradient-to-r from-green-200 to-emerald-200 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200">
                          <span className="inline-block w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></span>
                          Quality Score:{" "}
                          {(batch.allocationScore * 100).toFixed(1)}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-purple-700 dark:text-purple-200 leading-relaxed mb-4 font-medium">
                      {getAlgorithmDescription(batch.allocationAlgorithm)}
                    </p>
                    {batch.evaluationMetrics && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t border-purple-200 dark:border-purple-900/50">
                        <div className="bg-white dark:bg-stone-800/50 rounded p-3">
                          <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold mb-1">
                            Interest Similarity
                          </p>
                          <p className="text-lg font-bold text-purple-600 dark:text-purple-300">
                            {(
                              batch.evaluationMetrics.homogeneityScore * 100
                            ).toFixed(0)}
                            %
                          </p>
                          <p className="text-xs text-stone-400 dark:text-stone-500">
                            Homogeneity
                          </p>
                        </div>
                        <div className="bg-white dark:bg-stone-800/50 rounded p-3">
                          <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold mb-1">
                            Cluster Separation
                          </p>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-300">
                            {(
                              (((batch.evaluationMetrics.silhouetteScore || 0) +
                                1) /
                                2) *
                              100
                            ).toFixed(0)}
                            %
                          </p>
                          <p className="text-xs text-stone-400 dark:text-stone-500">
                            Silhouette
                          </p>
                        </div>
                        <div className="bg-white dark:bg-stone-800/50 rounded p-3">
                          <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold mb-1">
                            Batch Balance
                          </p>
                          <p className="text-lg font-bold text-amber-600 dark:text-amber-300">
                            {(
                              batch.evaluationMetrics.balanceScore * 100
                            ).toFixed(0)}
                            %
                          </p>
                          <p className="text-xs text-stone-400 dark:text-stone-500">
                            Uniformity
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 surface-card p-1.5">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 px-4 py-2 rounded-full font-medium transition ${
              activeTab === "overview"
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                : "text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
            }`}
          >
            Members ({members.length})
          </button>
          <button
            onClick={() => setActiveTab("similar")}
            className={`flex-1 px-4 py-2 rounded-full font-medium transition ${
              activeTab === "similar"
                ? "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
                : "text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
            }`}
          >
            Similar to You
          </button>
        </div>

        {/* Members Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <div
                key={member._id}
                className="surface-card p-4 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <HumanoidAvatar
                  src={member.profilePicture}
                  name={member.name}
                  size={64}
                  className="mb-3"
                />
                <h3 className="font-semibold text-stone-900 dark:text-stone-50">
                  {member.name}
                </h3>
                <p className="text-sm body-copy truncate">{member.email}</p>

                {member.college && (
                  <p className="text-xs body-copy mt-2">{member.college}</p>
                )}

                {member.interests && member.interests.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Interests
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {member.interests.slice(0, 2).map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-full text-xs font-medium border border-stone-200 bg-stone-100 text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
                        >
                          {interest}
                        </span>
                      ))}
                      {member.interests.length > 2 && (
                        <span className="px-2 py-1 body-copy text-xs">
                          +{member.interests.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {member.skills && member.skills.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-gray-600 mb-1">
                      Skills
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 2).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-full text-xs font-medium border border-stone-200 bg-stone-100 text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 2 && (
                        <span className="px-2 py-1 body-copy text-xs">
                          +{member.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {member._id === user._id && (
                  <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold border border-orange-200 bg-orange-100 text-orange-700 dark:border-orange-900/40 dark:bg-orange-950/20 dark:text-orange-300">
                      You
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Similar Users Tab */}
        {activeTab === "similar" && (
          <div className="space-y-3">
            {similarUsers.length > 0 ? (
              similarUsers.map((item, idx) => (
                <div
                  key={idx}
                  className="surface-card p-4 transition hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-stone-900 dark:text-stone-50">
                      {item.user.name}
                    </h3>
                    <p className="text-sm body-copy">{item.user.email}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.user.interests?.slice(0, 2).map((interest, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-full text-xs font-medium border border-stone-200 bg-stone-100 text-stone-700 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-semibold text-stone-900 dark:text-stone-50">
                      {(item.similarityScore * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs body-copy">match</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="surface-panel rounded-2xl p-8 text-center">
                <p className="body-copy">
                  No similar users found in your batch yet
                </p>
              </div>
            )}
          </div>
        )}

        {/* Batch Info Footer */}
        <div className="mt-6 surface-card p-4 text-sm">
          <p className="flex items-center gap-2">
            <span className="text-orange-600"></span>
            You can only see members of your own batch. This helps maintain
            privacy and focus collaboration within your study group.
          </p>
        </div>
      </div>
    </div>
  );
}
