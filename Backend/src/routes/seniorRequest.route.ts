import express from "express";
import { createSeniorRequest, pendingRequestToAdmin, approveRejectSeniorRequest } from "../controllers/seniorRequest";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../utils/cloudinaryConfig";

const router = express.Router();

router.post("/create", authMiddleware, upload.single("pdf"), asyncHandler(createSeniorRequest));
router.get("/pending", authMiddleware, asyncHandler(pendingRequestToAdmin));
router.post("/status", authMiddleware, asyncHandler(approveRejectSeniorRequest));

export default router;
