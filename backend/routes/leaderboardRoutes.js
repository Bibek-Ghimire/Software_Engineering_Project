import express from "express";
import { getLeaderboard } from "../controllers/leaderboardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getLeaderboard);


router.get("/", (req, res) => {
  res.json({ message: "Leaderboard route works!" });
});

export default router;
