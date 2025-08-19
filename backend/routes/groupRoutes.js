import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createGroup,
  getAllGroups,
  getMyGroups,
  joinGroup,
  leaveGroup
} from "../controllers/groupController.js";

const router = express.Router();

router.post("/", authMiddleware, createGroup);
router.get("/", getAllGroups);
router.get("/my", authMiddleware, getMyGroups);
router.put("/join/:groupId", authMiddleware, joinGroup);
router.put("/leave/:groupId", authMiddleware, leaveGroup);

export default router;
