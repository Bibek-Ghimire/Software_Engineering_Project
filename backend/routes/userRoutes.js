import express from "express";
import { getUsers, createUser } from "../controllers/userController.js";
import User from '../models/User.js';

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);

// GET teacher by ID (readonly)



router.get("/teachers", getAllTeachers); // Fetch all teachers




export default router;
