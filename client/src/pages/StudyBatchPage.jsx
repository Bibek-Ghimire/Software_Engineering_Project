import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import {
  getMyBatch,
  getMyBatchMembers,
  getMyBatchSimilarUsers,
} from "../services/batchService.js";
import HumanoidAvatar from "../components/HumanoidAvatar";

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
                  className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-300"
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

