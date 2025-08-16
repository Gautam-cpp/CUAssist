import express from "express";
import { message, getMessages } from "../controllers/guidance.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middleware/auth";


const router = express.Router();

router.post("/msg", authMiddleware, asyncHandler(message));
router.get("/msgs", authMiddleware, asyncHandler(getMessages));

export default router;
