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
      <div className="surface-panel p-4 text-red-700 dark:text-red-300">
        Error: {error}
      </div>
    );
  }

  if (!batchStats) return null;

  return (
    <div className="surface-card p-6">
      <h2 className="section-title mb-4 text-2xl md:text-3xl">
        Batch Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="surface-panel p-4">
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            Total Batches
          </p>
          <p className="text-3xl font-bold text-orange-600">
            {batchStats.totalBatches}
          </p>
        </div>

        <div className="surface-panel p-4">
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            Total Students
          </p>
          <p className="text-3xl font-bold text-green-600">
            {batchStats.totalStudents}
          </p>
        </div>

        <div className="surface-panel p-4">
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            Avg Batch Size
          </p>
          <p className="text-3xl font-bold text-purple-600">
            {batchStats.avgBatchSize}
          </p>
        </div>

        <div className="surface-panel p-4">
          <p className="text-stone-500 dark:text-stone-400 text-sm">
            Full Batches
          </p>
          <p className="text-3xl font-bold text-orange-600">
            {batchStats.fullBatches}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 text-stone-900 dark:text-white">
          Batch Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm overflow-hidden rounded-2xl border border-stone-200/70 dark:border-stone-700/70">
            <thead className="bg-stone-50 dark:bg-stone-800/80 border-b border-stone-200 dark:border-stone-700">
              <tr>
                <th className="px-4 py-3 text-left">Batch Name</th>
                <th className="px-4 py-3 text-left">Interests</th>
                <th className="px-4 py-3 text-center">Members</th>
                <th className="px-4 py-3 text-center">Fill %</th>
              </tr>
            </thead>
            <tbody>
              {batchStats.batchDetails?.map((batch) => (
                <tr
                  key={batch.batchId}
                  className="border-b border-stone-200/70 hover:bg-stone-50/80 dark:border-stone-700/70 dark:hover:bg-stone-800/50"
                >
                  <td className="px-4 py-3 font-medium">{batch.name}</td>
                  <td className="px-4 py-3">
                    {batch.interests.join(", ") || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {batch.memberCount}/{batch.maxSize}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 h-2 bg-stone-200 rounded-full overflow-hidden">
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
        className="secondary-action mt-4"
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
        className="primary-action rounded-full px-6 py-3 disabled:bg-stone-400"
      >
        {loading ? "Allocating..." : "Auto-Allocate Batches"}
      </button>

      {result && (
        <div className="surface-panel border-emerald-200 p-4 text-emerald-700 dark:border-emerald-800/50 dark:text-emerald-300">
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
    <div className="surface-card p-6">
      <h3 className="text-lg font-semibold mb-4 text-stone-900 dark:text-white">
        Similar Users
      </h3>
      <div className="space-y-3">
        {similarUsers.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-2xl border border-stone-200/70 bg-stone-50/80 p-3 dark:border-stone-700/70 dark:bg-stone-800/50"
          >
            <div>
              <p className="font-medium">{item.user.name}</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {item.user.email}
              </p>
            </div>
            <p className="text-sm font-semibold text-orange-600">
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
    return (
      <div className="text-stone-600 dark:text-stone-300">Batch not found</div>
    );
  }

  return (
    <div className="surface-card p-6">
      <h3 className="text-lg font-semibold mb-4">
        {batch.name} ({batch.members?.length || 0}/{batch.maxSize})
      </h3>

      {batch.interests?.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-2">
            Key Interests:
          </p>
          <div className="flex gap-2 flex-wrap">
            {batch.interests.map((interest, idx) => (
              <span
                key={idx}
                className="control-pill rounded-full bg-orange-50 px-3 py-1 text-sm text-orange-700 dark:bg-orange-950/30 dark:text-orange-300"
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
            className="flex items-center justify-between rounded-2xl border border-stone-200/70 bg-stone-50/80 p-3 dark:border-stone-700/70 dark:bg-stone-800/50"
          >
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">
                {member.email}
              </p>
            </div>
            <div>
              {member.interests?.length > 0 && (
                <p className="text-xs text-stone-500 dark:text-stone-400">
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
      <div className="surface-panel p-4">
        <p className="text-sm text-stone-600 dark:text-stone-300">
          Not assigned to a batch yet. Complete your profile to be assigned.
        </p>
      </div>
    );
  }

  return (
    <div className="surface-panel p-4">
      <h3 className="font-semibold text-stone-900 dark:text-white mb-2">
        {batchData.name}
      </h3>
      <p className="text-sm text-stone-600 dark:text-stone-300 mb-2">
        {batchData.memberCount} of {batchData.maxSize} members
      </p>
      <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden mb-2 dark:bg-stone-700">
        <div
          className="bg-gradient-to-r from-orange-500 to-amber-500 h-full"
          style={{ width: `${batchData.fillPercentage}%` }}
        ></div>
      </div>
      {batchData.dominantInterests?.length > 0 && (
        <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-700">
          <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 mb-2">
            Batch Interests
          </p>
          <div className="flex flex-wrap gap-1">
            {batchData.dominantInterests.map((interest, idx) => (
              <span
                key={idx}
                className="rounded-full bg-orange-50 px-2 py-1 text-xs text-orange-700 dark:bg-orange-950/30 dark:text-orange-300"
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
