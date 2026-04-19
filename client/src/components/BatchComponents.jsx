import React, { useState } from "react";
import { useBatchContext } from "../context/BatchContext.jsx";
import { useBatchStats } from "../hooks/useBatch.js";

/**
 * BATCH STATISTICS DASHBOARD COMPONENT
 * Displays batch overview and statistics
 */
export const BatchStatistics = () => {
  const { batchStats, loading, error, refetch } = useBatchStats();

  if (loading) {
    return <div className="text-center py-4">Loading batch statistics...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">Error: {error}</div>
    );
  }

  if (!batchStats) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Batch Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Total Batches</p>
          <p className="text-3xl font-bold text-blue-600">
            {batchStats.totalBatches}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Total Students</p>
          <p className="text-3xl font-bold text-green-600">
            {batchStats.totalStudents}
          </p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Avg Batch Size</p>
          <p className="text-3xl font-bold text-purple-600">
            {batchStats.avgBatchSize}
          </p>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-gray-600 text-sm">Full Batches</p>
          <p className="text-3xl font-bold text-orange-600">
            {batchStats.fullBatches}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Batch Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Batch Name</th>
                <th className="px-4 py-2 text-left">Interests</th>
                <th className="px-4 py-2 text-center">Members</th>
                <th className="px-4 py-2 text-center">Fill %</th>
              </tr>
            </thead>
            <tbody>
              {batchStats.batchDetails?.map((batch) => (
                <tr
                  key={batch.batchId}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-2 font-medium">{batch.name}</td>
                  <td className="px-4 py-2">
                    {batch.interests.join(", ") || "N/A"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {batch.memberCount}/{batch.maxSize}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${batch.fillPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">
                        {batch.fillPercentage}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button
        onClick={refetch}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Refresh Statistics
      </button>
    </div>
  );
};

/**
 * AUTO ALLOCATE BATCHES COMPONENT
 * Trigger auto batch allocation for all students
 */
export const AutoAllocateBatchesButton = ({ onSuccess, onError }) => {
  const { handleAutoAllocate, loading } = useBatchContext();
  const [result, setResult] = useState(null);

  const handleClick = async () => {
    try {
      const data = await handleAutoAllocate();
      setResult(data);
      onSuccess?.(data);
    } catch (error) {
      onError?.(error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 transition"
      >
        {loading ? "Allocating..." : "Auto-Allocate Batches"}
      </button>

      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 p-4 rounded">
          <p className="font-semibold">{result.message}</p>
          <p className="text-sm mt-2">
            Created {result.data.totalBatches} batches for{" "}
            {result.data.totalStudents} students
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * SIMILAR USERS COMPONENT
 * Display top 5 similar users for current user
 */
export const SimilarUsersCard = ({ userId }) => {
  const { similarUsers, loading } = useBatchContext();

  React.useEffect(() => {
    const { fetchSimilarUsers } = useBatchContext();
    if (userId) {
      fetchSimilarUsers(userId);
    }
  }, [userId]);

  if (loading) {
    return <div className="text-center py-4">Loading similar users...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Similar Users</h3>
      <div className="space-y-3">
        {similarUsers.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center p-3 bg-gray-50 rounded"
          >
            <div>
              <p className="font-medium">{item.user.name}</p>
              <p className="text-sm text-gray-600">{item.user.email}</p>
            </div>
            <p className="text-sm font-semibold text-blue-600">
              {(item.similarityScore * 100).toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * BATCH MEMBERS COMPONENT
 * Display members in a specific batch
 */
export const BatchMembers = ({ batchId }) => {
  const { batches, loading } = useBatchContext();
  const batch = batches.find((b) => b._id === batchId);

  if (loading) {
    return <div className="text-center py-4">Loading batch members...</div>;
  }

  if (!batch) {
    return <div className="text-gray-600">Batch not found</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">
        {batch.name} ({batch.members?.length || 0}/{batch.maxSize})
      </h3>

      {batch.interests?.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Key Interests:</p>
          <div className="flex gap-2 flex-wrap">
            {batch.interests.map((interest, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {batch.members?.map((member) => (
          <div
            key={member._id}
            className="p-3 bg-gray-50 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-gray-600">{member.email}</p>
            </div>
            <div>
              {member.interests?.length > 0 && (
                <p className="text-xs text-gray-500">
                  {member.interests.slice(0, 2).join(", ")}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * COMPACT BATCH INFO CARD
 * Quick overview of user's batch information
 * Suitable for dashboard embedding
 */
export const CompactBatchInfoCard = ({ batchData }) => {
  if (!batchData) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
        <p className="text-sm text-gray-600">
          Not assigned to a batch yet. Complete your profile to be assigned.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
      <h3 className="font-semibold text-gray-900 mb-2">{batchData.name}</h3>
      <p className="text-sm text-gray-600 mb-2">
        {batchData.memberCount} of {batchData.maxSize} members
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full"
          style={{ width: `${batchData.fillPercentage}%` }}
        ></div>
      </div>
      {batchData.dominantInterests?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs font-semibold text-gray-600 mb-2">
            Batch Interests
          </p>
          <div className="flex flex-wrap gap-1">
            {batchData.dominantInterests.map((interest, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * BATCH QUICK STATS
 * Minimal stats display for sidebarsor quick views
 */
export const BatchQuickStats = ({ members = [] }) => {
  if (members.length === 0) {
    return <div className="text-sm text-gray-500">No batch members</div>;
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-700">
        {members.length} {members.length === 1 ? "member" : "members"}
      </p>
      <div className="flex -space-x-2">
        {members.slice(0, 5).map((member) => (
          <div
            key={member._id}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white"
            title={member.name}
          >
            {member.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)}
          </div>
        ))}
        {members.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-bold border-2 border-white">
            +{members.length - 5}
          </div>
        )}
      </div>
    </div>
  );
};
