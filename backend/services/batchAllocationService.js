import User from "../models/User.js";
import Batch from "../models/Batch.js";

/**
 * JACCARD SIMILARITY CALCULATION
 * Measures similarity between two sets (interests/skills)
 * Formula: Intersection / Union
 */
const calculateJaccardSimilarity = (set1, set2) => {
  if (!set1 || !set2 || set1.length === 0 || set2.length === 0) {
    return 0;
  }

  const s1 = new Set(set1.map((s) => s.toLowerCase()));
  const s2 = new Set(set2.map((s) => s.toLowerCase()));

  const intersection = new Set([...s1].filter((x) => s2.has(x)));
  const union = new Set([...s1, ...s2]);

  return intersection.size / union.size;
};

/**
 * WEIGHTED SIMILARITY SCORE
 * Combines interest and skills similarity with weights
 * α = 0.7 (interests weight), β = 0.3 (skills weight)
 */
const calculateWeightedSimilarity = (user1, user2, alpha = 0.7, beta = 0.3) => {
  const interestSimilarity = calculateJaccardSimilarity(
    user1.interests,
    user2.interests,
  );
  const skillsSimilarity = calculateJaccardSimilarity(
    user1.skills,
    user2.skills,
  );

  return alpha * interestSimilarity + beta * skillsSimilarity;
};

/**
 * INTEREST-FOCUSED SIMILARITY
 * Measures similarity based purely on interests (ignores skills)
 * Best for grouping students with shared learning goals
 */
const calculateInterestOnlySimilarity = (user1, user2) => {
  return calculateJaccardSimilarity(user1.interests, user2.interests);
};

/**
 * COSINE SIMILARITY
 * Vector-based similarity measure
 * Formula: (A · B) / (||A|| * ||B||)
 * Better for normalized vectors with many dimensions
 */
const calculateCosineSimilarity = (vector1, vector2) => {
  if (vector1.length !== vector2.length || vector1.length === 0) {
    return 0;
  }

  const dotProduct = vector1.reduce(
    (sum, val1, idx) => sum + val1 * vector2[idx],
    0,
  );
  const magnitude1 = Math.sqrt(
    vector1.reduce((sum, val) => sum + val * val, 0),
  );
  const magnitude2 = Math.sqrt(
    vector2.reduce((sum, val) => sum + val * val, 0),
  );

  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  return dotProduct / (magnitude1 * magnitude2);
};

/**
 * FEATURE VECTOR GENERATION
 * Converts interests and skills into a normalized feature vector
 */
const generateFeatureVector = (user, allInterests, allSkills) => {
  const vector = [];

  // Interests vector
  allInterests.forEach((interest) => {
    vector.push(
      user.interests &&
        user.interests.some((i) => i.toLowerCase() === interest.toLowerCase())
        ? 1
        : 0,
    );
  });

  // Skills vector
  allSkills.forEach((skill) => {
    vector.push(
      user.skills &&
        user.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
        ? 1
        : 0,
    );
  });

  return vector;
};

/**
 * EUCLIDEAN DISTANCE
 * Used in K-Means clustering
 */
const euclideanDistance = (vector1, vector2) => {
  if (vector1.length !== vector2.length) return Infinity;
  const sumSquares = vector1.reduce(
    (sum, val1, idx) => sum + Math.pow(val1 - vector2[idx], 2),
    0,
  );
  return Math.sqrt(sumSquares);
};

/**
 * SIMPLIFIED K-MEANS CLUSTERING
 * Groups users based on similarity
 */
const kMeansClustering = (users, k) => {
  if (users.length === 0) return [];
  if (users.length <= k) {
    return users.map((user, idx) => ({ clusterId: idx, users: [user] }));
  }

  // Collect all unique interests and skills
  const allInterests = new Set();
  const allSkills = new Set();

  users.forEach((user) => {
    user.interests?.forEach((i) => allInterests.add(i.toLowerCase()));
    user.skills?.forEach((s) => allSkills.add(s.toLowerCase()));
  });

  const interestsArray = Array.from(allInterests);
  const skillsArray = Array.from(allSkills);

  if (interestsArray.length === 0 && skillsArray.length === 0) {
    // No interests/skills, divide equally
    const clustersCount = Math.min(k, Math.ceil(users.length / 10));
    const clusters = Array.from({ length: clustersCount }, (_, idx) => ({
      clusterId: idx,
      users: [],
    }));
    users.forEach((user, idx) => {
      clusters[idx % clustersCount].users.push(user);
    });
    return clusters;
  }

  // Generate feature vectors
  const vectorMap = new Map();
  users.forEach((user) => {
    vectorMap.set(
      user._id.toString(),
      generateFeatureVector(user, interestsArray, skillsArray),
    );
  });

  // Initialize centroids (randomly select k users)
  const centroids = [];
  const selectedIndices = new Set();
  for (let i = 0; i < Math.min(k, users.length); i++) {
    let randomIdx;
    do {
      randomIdx = Math.floor(Math.random() * users.length);
    } while (selectedIndices.has(randomIdx));
    selectedIndices.add(randomIdx);
    centroids.push(vectorMap.get(users[randomIdx]._id.toString()));
  }

  // K-Means iterations (max 10 iterations)
  let clusters = Array.from({ length: centroids.length }, (_, idx) => ({
    clusterId: idx,
    users: [],
    centroid: centroids[idx],
  }));

  for (let iteration = 0; iteration < 10; iteration++) {
    // Reset cluster assignments
    clusters.forEach((c) => (c.users = []));

    // Assign users to nearest centroid
    users.forEach((user) => {
      const userVector = vectorMap.get(user._id.toString());
      let minDistance = Infinity;
      let nearestCluster = 0;

      clusters.forEach((cluster, idx) => {
        const distance = euclideanDistance(userVector, cluster.centroid);
        if (distance < minDistance) {
          minDistance = distance;
          nearestCluster = idx;
        }
      });

      clusters[nearestCluster].users.push(user);
    });

    // Update centroids
    clusters.forEach((cluster) => {
      if (cluster.users.length > 0) {
        const newCentroid = Array.from(
          { length: centroids[0].length },
          (_, dim) =>
            cluster.users.reduce((sum, user) => {
              return sum + vectorMap.get(user._id.toString())[dim];
            }, 0) / cluster.users.length,
        );
        cluster.centroid = newCentroid;
      }
    });
  }

  // Remove empty clusters
  return clusters.filter((c) => c.users.length > 0);
};

/**
 * HIERARCHICAL AGGLOMERATIVE CLUSTERING
 * Bottom-up approach: starts with each user as a cluster, merges closest pairs
 * More suitable for finding natural interest-based groupings
 */
const hierarchicalClustering = (users, targetClusterSize = 10) => {
  if (users.length === 0) return [];
  if (users.length <= targetClusterSize) {
    return [{ clusterId: 0, users }];
  }

  // Initialize clusters with individual users
  let clusters = users.map((user, idx) => ({
    clusterId: idx,
    users: [user],
    representativeUser: user,
  }));

  // Merge clusters until reaching target size
  while (clusters.length > Math.ceil(users.length / targetClusterSize)) {
    let maxSimilarity = -1;
    let mergeIdx1 = 0;
    let mergeIdx2 = 1;

    // Find the two most similar clusters
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        const similarity = calculateInterestOnlySimilarity(
          clusters[i].representativeUser,
          clusters[j].representativeUser,
        );

        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          mergeIdx1 = i;
          mergeIdx2 = j;
        }
      }
    }

    // Merge if similarity is above threshold (0.1)
    if (maxSimilarity > 0.1) {
      clusters[mergeIdx1].users.push(...clusters[mergeIdx2].users);

      // Update representative user (average interests)
      const mergedInterests = new Set();
      clusters[mergeIdx1].users.forEach((u) => {
        u.interests?.forEach((i) => mergedInterests.add(i));
      });
      clusters[mergeIdx1].representativeUser = {
        interests: Array.from(mergedInterests),
        skills: clusters[mergeIdx1].representativeUser.skills,
      };

      clusters.splice(mergeIdx2, 1);
    } else {
      break;
    }
  }

  return clusters.map((c, idx) => ({
    clusterId: idx,
    users: c.users,
  }));
};

/**
 * INTEREST-BASED GREEDY CLUSTERING
 * Greedy algorithm focused on maximizing interest overlap
 * Assigns each user to the cluster with most shared interests
 */
const interestBasedGreedyClustering = (users, maxClusterSize = 10) => {
  if (users.length === 0) return [];

  const clusters = [];
  const assignedUsers = new Set();

  // Sort users by number of interests (descending) to process varied users first
  const sortedUsers = [...users].sort(
    (a, b) => (b.interests?.length || 0) - (a.interests?.length || 0),
  );

  for (const user of sortedUsers) {
    if (assignedUsers.has(user._id.toString())) continue;

    // Try to find best matching existing cluster
    let bestCluster = null;
    let bestScore = -1;

    for (const cluster of clusters) {
      if (cluster.users.length >= maxClusterSize) continue;

      // Calculate interest overlap with cluster
      let overlapScore = 0;
      let overlapCount = 0;

      cluster.users.forEach((clusterMember) => {
        const score = calculateInterestOnlySimilarity(user, clusterMember);
        overlapScore += score;
        overlapCount++;
      });

      const avgScore = overlapCount > 0 ? overlapScore / overlapCount : 0;

      if (avgScore > bestScore) {
        bestScore = avgScore;
        bestCluster = cluster;
      }
    }

    // Add to best cluster if found and has good overlap, otherwise create new cluster
    if (bestCluster && bestScore >= 0.2) {
      bestCluster.users.push(user);
      assignedUsers.add(user._id.toString());
    } else {
      // Create new cluster
      clusters.push({
        clusterId: clusters.length,
        users: [user],
      });
      assignedUsers.add(user._id.toString());
    }
  }

  return clusters;
};

/**
 * DBSCAN-LIKE CLUSTERING
 * Density-based clustering: groups users with high interest overlap (eps threshold)
 * Good for finding natural communities of similar interests
 */
const dbscanLikeClustering = (users, eps = 0.3, minUsers = 2) => {
  if (users.length === 0) return [];

  const clusters = [];
  const visited = new Set();
  const clusterId = {};

  const getNeighbors = (user) => {
    return users.filter((other) => {
      if (user._id.toString() === other._id.toString()) return false;
      const similarity = calculateInterestOnlySimilarity(user, other);
      return similarity >= eps;
    });
  };

  const expandCluster = (user, clusterNum) => {
    const cluster = { clusterId: clusterNum, users: [user] };
    visited.add(user._id.toString());
    clusterId[user._id.toString()] = clusterNum;

    const neighbors = getNeighbors(user);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor._id.toString())) {
        visited.add(neighbor._id.toString());
        const neighborNeighbors = getNeighbors(neighbor);

        if (neighborNeighbors.length >= minUsers) {
          cluster.users.push(
            ...getNeighbors(neighbor).filter(
              (n) => !visited.has(n._id.toString()),
            ),
          );
        } else {
          cluster.users.push(neighbor);
        }
      } else if (!(neighbor._id.toString() in clusterId)) {
        cluster.users.push(neighbor);
      }
    }

    return cluster;
  };

  let clusterNum = 0;
  for (const user of users) {
    if (visited.has(user._id.toString())) continue;

    const neighbors = getNeighbors(user);
    if (neighbors.length >= minUsers) {
      clusters.push(expandCluster(user, clusterNum++));
    } else {
      visited.add(user._id.toString());
    }
  }

  // Assign noise points to nearest cluster
  for (const user of users) {
    if (!(user._id.toString() in clusterId)) {
      let closestCluster = clusters[0];
      let maxSimilarity = -1;

      for (const cluster of clusters) {
        const similarities = cluster.users.map((u) =>
          calculateInterestOnlySimilarity(user, u),
        );
        const avgSimilarity =
          similarities.length > 0
            ? similarities.reduce((a, b) => a + b) / similarities.length
            : 0;

        if (avgSimilarity > maxSimilarity) {
          maxSimilarity = avgSimilarity;
          closestCluster = cluster;
        }
      }

      if (closestCluster && closestCluster.users.length < 10) {
        closestCluster.users.push(user);
      }
    }
  }

  return clusters.filter((c) => c.users.length > 0);
};

/**
 * SPECTRAL CLUSTERING (SIMPLIFIED)
 * Graph-based clustering using interest similarity
 * Groups users into connected components of high similarity
 */
const spectralClustering = (users, similarityThreshold = 0.25) => {
  if (users.length === 0) return [];
  if (users.length <= 2) {
    return [{ clusterId: 0, users }];
  }

  // Build adjacency based on similarity
  const graph = new Map();
  users.forEach((user) => {
    graph.set(user._id.toString(), []);
  });

  users.forEach((user1, idx1) => {
    for (let idx2 = idx1 + 1; idx2 < users.length; idx2++) {
      const user2 = users[idx2];
      const similarity = calculateInterestOnlySimilarity(user1, user2);

      if (similarity >= similarityThreshold) {
        graph.get(user1._id.toString()).push(user2._id.toString());
        graph.get(user2._id.toString()).push(user1._id.toString());
      }
    }
  });

  // Find connected components
  const visited = new Set();
  const clusters = [];
  let clusterNum = 0;

  const dfs = (userId, cluster) => {
    visited.add(userId);
    const user = users.find((u) => u._id.toString() === userId);
    if (user) cluster.users.push(user);

    for (const neighborId of graph.get(userId)) {
      if (!visited.has(neighborId)) {
        dfs(neighborId, cluster);
      }
    }
  };

  for (const user of users) {
    const userId = user._id.toString();
    if (!visited.has(userId)) {
      const cluster = { clusterId: clusterNum++, users: [] };
      dfs(userId, cluster);
      if (cluster.users.length > 0) {
        clusters.push(cluster);
      }
    }
  }

  return clusters;
};

/**
 * CALCULATE DOMINANT INTERESTS
 * Returns top 3 interests for a batch
 */
const calculateDominantInterests = (users) => {
  const interestCount = {};

  users.forEach((user) => {
    user.interests?.forEach((interest) => {
      const key = interest.toLowerCase();
      interestCount[key] = (interestCount[key] || 0) + 1;
    });
  });

  return Object.entries(interestCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([interest]) => interest);
};

/**
 * FIND TOP 5 SIMILAR USERS TO A TARGET USER
 */
const findTopSimilarUsers = (targetUser, allUsers, limit = 5) => {
  const similarities = allUsers
    .filter((user) => user._id.toString() !== targetUser._id.toString())
    .map((user) => ({
      user,
      score: calculateWeightedSimilarity(targetUser, user),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return similarities;
};

/**
 * ALLOCATE NEW USER TO BEST MATCHING BATCH
 * Uses interest-based similarity to find the best matching batch
 * If no matching batch or all full, create new batch
 *
 * Similarity Threshold: 0.2 (20% interest overlap)
 */
const allocateUserToBatch = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Get all batches that are not full (members.length < 10)
    const allBatches = await Batch.find({}).populate(
      "members",
      "name interests",
    );

    // Filter batches that are not full
    const batches = allBatches.filter((batch) => batch.members.length < 10);

    if (!user.interests || user.interests.length === 0) {
      // User has no interests, create a new batch
      const newBatch = await Batch.create({
        name: `Batch-General-${Date.now()}`,
        interests: [],
        members: [userId],
        maxSize: 10,
        allocationAlgorithm: "greedy",
      });
      user.batchId = newBatch._id;
      await user.save();
      return { batch: newBatch, created: true };
    }

    // Calculate interest-based similarity with each batch
    const batchScores = batches
      .map((batch) => {
        let totalScore = 0;
        let validComparisons = 0;

        // Compare user interests with each batch member
        batch.members.forEach((member) => {
          const score = calculateInterestOnlySimilarity(user, member);
          totalScore += score;
          validComparisons++;
        });

        const avgScore =
          validComparisons > 0 ? totalScore / validComparisons : 0;
        return { batch, score: avgScore };
      })
      .sort((a, b) => b.score - a.score);

    // Use a similarity threshold of 0.15 (15% interest overlap)
    if (batchScores.length > 0 && batchScores[0].score >= 0.15) {
      // Assign to best matching batch
      const bestBatch = batchScores[0].batch;
      bestBatch.members.push(userId);
      await bestBatch.save();
      user.batchId = bestBatch._id;
      await user.save();
      return {
        batch: bestBatch,
        created: false,
        similarity: batchScores[0].score,
      };
    } else {
      // Create new batch with student's interests
      const dominantInterests = calculateDominantInterests([user]);
      const newBatch = await Batch.create({
        name: `Batch-${dominantInterests.join("-") || "General"}-${Date.now()}`,
        interests: dominantInterests,
        members: [userId],
        maxSize: 10,
        allocationAlgorithm: "greedy",
      });
      user.batchId = newBatch._id;
      await user.save();
      return { batch: newBatch, created: true };
    }
  } catch (error) {
    throw new Error(`Batch allocation failed: ${error.message}`);
  }
};

/**
 * ALLOCATE ALL STUDENTS IN DATABASE TO BATCHES
 * Processes all unallocated students and assigns them to batches
 * Uses greedy algorithm to maximize interest-based grouping
 */
const allocateAllStudentsToBatches = async () => {
  try {
    // Get all students not yet allocated to a batch
    // batchId can be either null or not exist
    const unallocatedStudents = await User.find({
      role: "student",
      $or: [{ batchId: { $exists: false } }, { batchId: null }],
    });

    if (unallocatedStudents.length === 0) {
      return {
        message: "All students already allocated",
        allocated: 0,
        totalStudents: 0,
        totalBatches: 0,
        batches: [],
      };
    }

    // Clear existing batches
    await Batch.deleteMany({});

    // Sort students by interest diversity (more diverse = process first)
    const sortedStudents = unallocatedStudents.sort(
      (a, b) => (b.interests?.length || 0) - (a.interests?.length || 0),
    );

    const batches = [];
    const allocatedStudents = new Set();

    // Greedy allocation: assign each student to best matching batch
    for (const student of sortedStudents) {
      if (allocatedStudents.has(student._id.toString())) continue;

      if (!student.interests || student.interests.length === 0) {
        // Create a single-student batch for users with no interests
        const batch = await Batch.create({
          name: `Batch-General-${Date.now()}`,
          interests: [],
          members: [student._id],
          maxSize: 10,
          allocationAlgorithm: "greedy",
        });
        student.batchId = batch._id;
        await student.save();
        allocatedStudents.add(student._id.toString());
        batches.push(batch);
        continue;
      }

      // Try to find best matching batch
      let bestBatch = null;
      let bestScore = -1;

      for (const batch of batches) {
        if (batch.members.length >= 10) continue;

        // Calculate average similarity with batch members
        let totalScore = 0;
        const batchMembers = await User.find({
          _id: { $in: batch.members },
        });

        batchMembers.forEach((member) => {
          const score = calculateInterestOnlySimilarity(student, member);
          totalScore += score;
        });

        const avgScore = totalScore / batchMembers.length;

        if (avgScore > bestScore) {
          bestScore = avgScore;
          bestBatch = batch;
        }
      }

      // If found a matching batch with threshold met, use it
      if (bestBatch && bestScore >= 0.15) {
        bestBatch.members.push(student._id);
        await bestBatch.save();
        student.batchId = bestBatch._id;
        await student.save();
        allocatedStudents.add(student._id.toString());
      } else {
        // Create new batch for this student
        const studentInterests = calculateDominantInterests([student]);
        const newBatch = await Batch.create({
          name: `Batch-${studentInterests.join("-") || "General"}-${Date.now()}`,
          interests: studentInterests,
          members: [student._id],
          maxSize: 10,
          allocationAlgorithm: "greedy",
        });
        student.batchId = newBatch._id;
        await student.save();
        allocatedStudents.add(student._id.toString());
        batches.push(newBatch);
      }
    }

    return {
      message: "All students allocated successfully",
      totalStudents: sortedStudents.length,
      allocated: allocatedStudents.size,
      totalBatches: batches.length,
      batches: batches,
    };
  } catch (error) {
    throw new Error(
      `Batch allocation for all students failed: ${error.message}`,
    );
  }
};

/**
 * REALLOCATE USER IF INTERESTS CHANGED
 */
const reallocateUserBatch = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Remove from current batch
    if (user.batchId) {
      await Batch.findByIdAndUpdate(
        user.batchId,
        { $pull: { members: userId } },
        { new: true },
      );
    }

    // Reallocate to best batch
    return await allocateUserToBatch(userId);
  } catch (error) {
    throw new Error(`Batch reallocation failed: ${error.message}`);
  }
};

/** * SMART CLUSTER SPLITTING
 * Splits large clusters (>10 members) while preserving similarity
 * Uses greedy algorithm to create sub-batches with similar interests
 */
const smartClusterSplitting = (cluster, maxBatchSize = 10) => {
  if (cluster.users.length <= maxBatchSize) {
    return [cluster];
  }

  // For large clusters, apply greedy re-clustering to maintain similarity
  const subBatches = [];
  const unassigned = new Set(cluster.users.map((u) => u._id.toString()));

  while (unassigned.size > 0) {
    const unassignedUsers = cluster.users.filter((u) =>
      unassigned.has(u._id.toString()),
    );

    if (unassignedUsers.length === 0) break;

    // Start a new sub-batch with the first unassigned user
    const currentBatch = [unassignedUsers[0]];
    unassigned.delete(unassignedUsers[0]._id.toString());

    // Greedily add most similar users to this batch
    while (currentBatch.length < maxBatchSize && unassigned.size > 0) {
      const remainingUsers = cluster.users.filter((u) =>
        unassigned.has(u._id.toString()),
      );

      let bestUser = null;
      let bestSimilarity = -1;

      // Find the user most similar to the current batch
      for (const candidate of remainingUsers) {
        let totalSimilarity = 0;
        for (const batchMember of currentBatch) {
          totalSimilarity += calculateInterestOnlySimilarity(
            candidate,
            batchMember,
          );
        }
        const avgSimilarity = totalSimilarity / currentBatch.length;

        if (avgSimilarity > bestSimilarity) {
          bestSimilarity = avgSimilarity;
          bestUser = candidate;
        }
      }

      if (bestUser && bestSimilarity >= 0) {
        currentBatch.push(bestUser);
        unassigned.delete(bestUser._id.toString());
      } else if (remainingUsers.length > 0) {
        // If no good match, just add the next user
        currentBatch.push(remainingUsers[0]);
        unassigned.delete(remainingUsers[0]._id.toString());
      }
    }

    subBatches.push({
      clusterId: subBatches.length,
      users: currentBatch,
    });
  }

  return subBatches;
};

/** * AUTO BATCH ALLOCATION (FULL SYSTEM)
 * Clusters all users and creates batches accordingly
 * Supports multiple clustering algorithms for interest-based grouping
 *
 * Available algorithms:
 * - 'kmeans' (default): K-Means clustering
 * - 'hierarchical': Hierarchical Agglomerative Clustering
 * - 'greedy': Interest-Based Greedy Clustering
 * - 'dbscan': DBSCAN-like Clustering
 * - 'spectral': Spectral Clustering
 */
const autoBatchAllocation = async (algorithm = "kmeans") => {
  try {
    // Get all students with interests/skills
    const students = await User.find({ role: "student" });

    if (students.length === 0) {
      return { message: "No students to batch", batches: [], algorithm };
    }

    let clusters;

    // Select clustering algorithm
    switch (algorithm.toLowerCase()) {
      case "hierarchical":
        clusters = hierarchicalClustering(students, 10);
        break;

      case "greedy":
        clusters = interestBasedGreedyClustering(students, 10);
        break;

      case "dbscan":
        clusters = dbscanLikeClustering(students, 0.3, 2);
        break;

      case "spectral":
        clusters = spectralClustering(students, 0.25);
        break;

      case "kmeans":
      default:
        const optimalK = Math.ceil(students.length / 10);
        clusters = kMeansClustering(students, optimalK);
        break;
    }

    // Delete old batches
    await Batch.deleteMany({});

    // Create new batches from clusters with smart splitting
    const newBatches = [];
    for (const cluster of clusters) {
      // Use smart splitting to preserve similarity when cluster is large
      const subBatches = smartClusterSplitting(cluster, 10);

      for (const subBatch of subBatches) {
        const dominantInterests = calculateDominantInterests(subBatch.users);
        const memberIds = subBatch.users.map((u) => u._id);

        const batch = await Batch.create({
          name: `Batch-${dominantInterests.join("-") || "General"}-${Date.now()}-${subBatch.clusterId}`,
          interests: dominantInterests,
          members: memberIds,
          maxSize: 10,
          allocationAlgorithm: algorithm,
        });
        newBatches.push(batch);
      }
    }

    // Update user batch IDs
    for (const batch of newBatches) {
      await User.updateMany(
        { _id: { $in: batch.members } },
        { batchId: batch._id },
      );
    }

    return {
      message: "Batch allocation completed",
      algorithm: algorithm,
      totalClusters: clusters.length,
      totalBatches: newBatches.length,
      batches: newBatches,
    };
  } catch (error) {
    throw new Error(`Auto batch allocation failed: ${error.message}`);
  }
};

export {
  // Similarity Measures
  calculateJaccardSimilarity,
  calculateWeightedSimilarity,
  calculateInterestOnlySimilarity,
  calculateCosineSimilarity,

  // Clustering Algorithms
  kMeansClustering,
  hierarchicalClustering,
  interestBasedGreedyClustering,
  dbscanLikeClustering,
  spectralClustering,

  // Batch Operations
  calculateDominantInterests,
  findTopSimilarUsers,
  allocateUserToBatch,
  reallocateUserBatch,
  allocateAllStudentsToBatches,
  autoBatchAllocation,
};
