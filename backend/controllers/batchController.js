import Batch from "../models/Batch.js";
import User from "../models/User.js";
import {
  autoBatchAllocation,
  allocateUserToBatch,
  allocateAllStudentsToBatches,
  reallocateUserBatch,
  findTopSimilarUsers,
  calculateDominantInterests,
} from "../services/batchAllocationService.js";

/**
 * AUTO ALLOCATE ALL STUDENTS TO BATCHES
 * POST /api/batches/auto-allocate
 * Query/Body parameters:
 * - algorithm: 'kmeans' (default) | 'hierarchical' | 'greedy' | 'dbscan' | 'spectral'
 */
export const autoAllocateBatches = async (req, res) => {
  try {
    // Get algorithm from query or body parameters
    const algorithm = req.query.algorithm || req.body.algorithm || "kmeans";

    const validAlgorithms = [
      "kmeans",
      "hierarchical",
      "greedy",
      "dbscan",
      "spectral",
    ];
    if (!validAlgorithms.includes(algorithm.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid algorithm. Supported: ${validAlgorithms.join(", ")}`,
      });
    }

    const result = await autoBatchAllocation(algorithm);
    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ALLOCATE ALL STUDENTS IN DATABASE TO BATCHES
 * POST /api/batches/allocate-all-students
 * Processes all unallocated students and groups them by interest similarity
 */
export const allocateAllStudents = async (req, res) => {
  try {
    const result = await allocateAllStudentsToBatches();
    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        totalStudents: result.totalStudents || 0,
        allocated: result.allocated || 0,
        totalBatches: result.totalBatches || 0,
        batches: (result.batches || []).map((batch) => ({
          _id: batch._id,
          name: batch.name,
          interests: batch.interests,
          memberCount: batch.members.length,
          maxSize: batch.maxSize,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * ALLOCATE SINGLE USER (NEW REGISTRATION)
 * POST /api/batches/allocate-user/:userId
 */
export const allocateSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await allocateUserToBatch(userId);

    res.status(200).json({
      success: true,
      message: `User allocated to ${result.created ? "new" : "existing"} batch`,
      data: {
        batchId: result.batch._id,
        batchName: result.batch.name,
        isNewBatch: result.created,
        batchSize: result.batch.members.length,
        similarityScore: result.similarity || "N/A",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * REALLOCATE USER (INTEREST UPDATE)
 * POST /api/batches/reallocate-user/:userId
 */
export const reallocateSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await reallocateUserBatch(userId);

    res.status(200).json({
      success: true,
      message: `User reallocated to ${
        result.created ? "new" : "existing"
      } batch`,
      data: {
        batchId: result.batch._id,
        batchName: result.batch.name,
        isNewBatch: result.created,
        batchSize: result.batch.members.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET ALL BATCHES WITH MEMBERS
 * GET /api/batches
 */
export const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find().populate(
      "members",
      "name email interests skills",
    );

    res.status(200).json({
      success: true,
      data: batches,
      count: batches.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET SINGLE BATCH DETAILS
 * GET /api/batches/:batchId
 */
export const getBatchById = async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findById(batchId).populate(
      "members",
      "name email interests skills",
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET USER'S BATCH
 * GET /api/batches/user/:userId
 */
export const getUserBatch = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.batchId) {
      return res.status(404).json({
        success: false,
        message: "User not assigned to any batch",
      });
    }

    const batch = await Batch.findById(user.batchId).populate(
      "members",
      "name email interests skills",
    );

    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET TOP 5 SIMILAR USERS FOR A USER
 * GET /api/batches/similar-users/:userId
 */
export const getSimilarUsers = async (req, res) => {
  try {
    const { userId } = req.params;
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const allUsers = await User.find();
    const similarUsers = findTopSimilarUsers(targetUser, allUsers, 5);

    res.status(200).json({
      success: true,
      data: similarUsers.map((item) => ({
        user: {
          id: item.user._id,
          name: item.user.name,
          email: item.user.email,
          interests: item.user.interests,
          skills: item.user.skills,
        },
        similarityScore: item.score,
      })),
      count: similarUsers.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET BATCH DOMINANT INTERESTS
 * GET /api/batches/:batchId/dominant-interests
 */
export const getBatchDominantInterests = async (req, res) => {
  try {
    const { batchId } = req.params;
    const batch = await Batch.findById(batchId).populate("members");

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    const dominantInterests = calculateDominantInterests(batch.members);

    res.status(200).json({
      success: true,
      data: {
        batchId: batch._id,
        batchName: batch.name,
        dominantInterests,
        memberCount: batch.members.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * REMOVE USER FROM BATCH
 * DELETE /api/batches/:batchId/members/:userId
 */
export const removeUserFromBatch = async (req, res) => {
  try {
    const { batchId, userId } = req.params;

    const batch = await Batch.findByIdAndUpdate(
      batchId,
      { $pull: { members: userId } },
      { new: true },
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    await User.findByIdAndUpdate(userId, { batchId: null });

    res.status(200).json({
      success: true,
      message: "User removed from batch",
      data: batch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * DELETE BATCH
 * DELETE /api/batches/:batchId
 */
export const deleteBatch = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findByIdAndDelete(batchId);

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    // Remove batch reference from users
    await User.updateMany({ batchId }, { batchId: null });

    res.status(200).json({
      success: true,
      message: "Batch deleted successfully",
      data: batch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET BATCH STATISTICS
 * GET /api/batches/stats/overview
 */
export const getBatchStatistics = async (req, res) => {
  try {
    const batches = await Batch.find().populate("members");

    const stats = {
      totalBatches: batches.length,
      totalStudents: batches.reduce((sum, b) => sum + b.members.length, 0),
      avgBatchSize:
        batches.length > 0
          ? (
              batches.reduce((sum, b) => sum + b.members.length, 0) /
              batches.length
            ).toFixed(2)
          : 0,
      fullBatches: batches.filter((b) => b.members.length === b.maxSize).length,
      batchDetails: batches.map((batch) => ({
        batchId: batch._id,
        name: batch.name,
        interests: batch.interests,
        memberCount: batch.members.length,
        maxSize: batch.maxSize,
        fillPercentage: ((batch.members.length / batch.maxSize) * 100).toFixed(
          2,
        ),
      })),
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET CURRENT USER'S BATCH (PROTECTED)
 * GET /api/batches/my-batch
 */
export const getMyBatch = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.batchId) {
      return res.status(404).json({
        success: false,
        message: "You are not assigned to any batch yet",
      });
    }

    const batch = await Batch.findById(user.batchId).populate(
      "members",
      "name email interests skills profilePicture college",
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    // Calculate dominant interests
    const dominantInterests = calculateDominantInterests(batch.members);

    res.status(200).json({
      success: true,
      data: {
        _id: batch._id,
        name: batch.name,
        interests: batch.interests,
        dominantInterests: dominantInterests,
        members: batch.members,
        memberCount: batch.members.length,
        maxSize: batch.maxSize,
        fillPercentage: ((batch.members.length / batch.maxSize) * 100).toFixed(
          2,
        ),
        createdAt: batch.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET MY BATCH MEMBERS (PROTECTED)
 * GET /api/batches/my-batch/members
 */
export const getMyBatchMembers = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user || !user.batchId) {
      return res.status(404).json({
        success: false,
        message: "You are not assigned to any batch",
      });
    }

    const batch = await Batch.findById(user.batchId).populate(
      "members",
      "name email interests skills profilePicture college",
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.status(200).json({
      success: true,
      data: batch.members,
      count: batch.members.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET MY BATCH SIMILAR USERS (PROTECTED)
 * GET /api/batches/my-batch/similar-users
 */
export const getMyBatchSimilarUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!targetUser.batchId) {
      return res.status(404).json({
        success: false,
        message: "You are not assigned to any batch",
      });
    }

    // Get only members from user's batch
    const batch = await Batch.findById(targetUser.batchId).populate("members");
    const batchMembers = batch.members;

    const similarUsers = findTopSimilarUsers(targetUser, batchMembers, 5);

    res.status(200).json({
      success: true,
      data: similarUsers.map((item) => ({
        user: {
          id: item.user._id,
          name: item.user.name,
          email: item.user.email,
          interests: item.user.interests,
          skills: item.user.skills,
          profilePicture: item.user.profilePicture,
        },
        similarityScore: item.score,
      })),
      count: similarUsers.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * VERIFY USER CAN ACCESS BATCH
 * Internal helper for authorization
 */
const isUserInBatch = async (userId, batchId) => {
  const user = await User.findById(userId);
  return user && user.batchId && user.batchId.toString() === batchId.toString();
};

/**
 * GET PROTECTED BATCH BY ID (Only for members)
 * GET /api/batches/:batchId/protected
 */
export const getProtectedBatchById = async (req, res) => {
  try {
    const { batchId } = req.params;
    const userId = req.user._id;

    // Check if user is member of this batch
    const isUserMember = await isUserInBatch(userId, batchId);

    if (!isUserMember) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this batch",
      });
    }

    const batch = await Batch.findById(batchId).populate(
      "members",
      "name email interests skills profilePicture college",
    );

    if (!batch) {
      return res.status(404).json({
        success: false,
        message: "Batch not found",
      });
    }

    res.status(200).json({
      success: true,
      data: batch,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
