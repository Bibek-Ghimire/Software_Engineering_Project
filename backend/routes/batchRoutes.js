import express from "express";
import {
  autoAllocateBatches,
  allocateAllStudents,
  allocateSingleUser,
  reallocateSingleUser,
  getAllBatches,
  getBatchById,
  getUserBatch,
  getSimilarUsers,
  getBatchDominantInterests,
  removeUserFromBatch,
  deleteBatch,
  getBatchStatistics,
  getMyBatch,
  getMyBatchMembers,
  getMyBatchSimilarUsers,
  getProtectedBatchById,
} from "../controllers/batchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// PROTECTED ROUTES - Must come FIRST before dynamic routes
router.get("/protected/my-batch", protect, getMyBatch);
router.get("/protected/my-batch/members", protect, getMyBatchMembers);
router.get(
  "/protected/my-batch/similar-users",
  protect,
  getMyBatchSimilarUsers,
);
router.get("/protected/:batchId/members", protect, getProtectedBatchMembers);
router.get("/protected/:batchId/similar-users", protect, getProtectedBatchSimilarUsers);
router.get("/protected/:batchId", protect, getProtectedBatchById);

// Auto-allocation routes (admin)
router.post("/auto-allocate", autoAllocateBatches);
router.post("/allocate-all-students", allocateAllStudents);
router.post("/allocate-user/:userId", allocateSingleUser);
router.post("/reallocate-user/:userId", reallocateSingleUser);

// Public batch retrieval routes
router.get("/", getAllBatches);
router.get("/stats/overview", getBatchStatistics);
router.get("/:batchId", getBatchById);
router.get("/user/:userId", getUserBatch);
router.get("/similar-users/:userId", getSimilarUsers);
router.get("/:batchId/dominant-interests", getBatchDominantInterests);

// Batch management routes
router.delete("/:batchId/members/:userId", removeUserFromBatch);
router.delete("/:batchId", deleteBatch);

export default router;
