import express from "express";
import { uploadNotes, NotesApprovalReqForAdmin, showNotesStatusToUploader, showPendingNotesToAdmin, showNotesbySubject} from "../controllers/notes.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { authMiddleware } from "../middleware/auth";
import { upload } from "../utils/cloudinaryConfig";

const router = express.Router();

router.post("/upload", authMiddleware, upload.single("pdf"), asyncHandler(uploadNotes));
router.post("/admin/approval", authMiddleware, asyncHandler(NotesApprovalReqForAdmin));
router.get("/user/status", authMiddleware, asyncHandler(showNotesStatusToUploader));
router.get("/admin/pending", authMiddleware, asyncHandler(showPendingNotesToAdmin));
router.get("/notes/:semester/:subject", asyncHandler(showNotesbySubject));

export default router;
