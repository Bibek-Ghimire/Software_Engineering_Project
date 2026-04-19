import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth.js";
import {
  getMyBatch,
  getMyBatchMembers,
  getMyBatchSimilarUsers,
} from "../services/batchService.js";

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading batch information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              No Batch Assigned
            </h2>
            <p className="text-red-700">{error}</p>
            <p className="text-sm text-red-600 mt-3">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-yellow-800">
              Batch Information Not Available
            </h2>
            <p className="text-yellow-700 mt-2">
              Please contact an administrator for batch assignment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Study Batch</h1>
          <p className="text-gray-600 mt-1">
            Connect with students who share your interests
          </p>
        </div>

        {/* Batch Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {batch.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {batch.memberCount} of {batch.maxSize} members
              </p>
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${batch.fillPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {batch.fillPercentage}% full
              </p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Batch ID</p>
              <p className="font-mono text-sm text-indigo-600 break-all">
                {batch._id}
              </p>
            </div>
          </div>

          {/* Dominant Interests */}
          {batch.dominantInterests && batch.dominantInterests.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm font-semibold text-gray-600 mb-3">
                Key Interests in Batch
              </p>
              <div className="flex flex-wrap gap-2">
                {batch.dominantInterests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-1">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 px-4 py-2 rounded font-medium transition ${
              activeTab === "overview"
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Members ({members.length})
          </button>
          <button
            onClick={() => setActiveTab("similar")}
            className={`flex-1 px-4 py-2 rounded font-medium transition ${
              activeTab === "similar"
                ? "bg-indigo-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
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
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 border border-gray-100"
              >
                {member.profilePicture && (
                  <img
                    src={member.profilePicture}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover mb-3"
                  />
                )}
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500 truncate">{member.email}</p>

                {member.college && (
                  <p className="text-xs text-gray-600 mt-2">
                    📚 {member.college}
                  </p>
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
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                      {member.interests.length > 2 && (
                        <span className="px-2 py-1 text-gray-600 text-xs">
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
                          className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 2 && (
                        <span className="px-2 py-1 text-gray-600 text-xs">
                          +{member.skills.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {member._id === user._id && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded">
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
                  className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 border border-gray-100 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.user.name}
                    </h3>
                    <p className="text-sm text-gray-500">{item.user.email}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.user.interests?.slice(0, 2).map((interest, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm font-semibold text-indigo-600">
                      {(item.similarityScore * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">match</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <p className="text-gray-600">
                  No similar users found in your batch yet
                </p>
              </div>
            )}
          </div>
        )}

        {/* Batch Info Footer */}
        <div className="mt-6 bg-white rounded-lg shadow p-4 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <span className="text-blue-600">ℹ️</span>
            You can only see members of your own batch. This helps maintain
            privacy and focus collaboration within your study group.
          </p>
        </div>
      </div>
    </div>
  );
}
