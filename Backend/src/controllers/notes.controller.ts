import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import cloudinary from "../utils/cloudinaryConfig";

export const uploadNotes = async (req: Request, res: Response) => {
    const userId = req.userId;
    const { pdfName, semester, subject } = req.body;

    if (!pdfName || !semester || !subject || !req.file) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try{
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const { secure_url: fileUrl } = await cloudinary.uploader.upload(req.file.path, {
            folder: "notes",
            resource_type: "raw"
        });

        const note = await prisma.note.create({
            data: {
                pdfName,
                semester,
                subject,
                fileUrl,
                uploaderId: userId
            }
        });

        return res.status(201).json({ message: "Note uploaded successfully", note });
    } catch (error) {
        console.error("Error uploading note:", error);
        return res.status(500).json({ message: "Server error: " + error });
    }

}

export const NotesApprovalReqForAdmin = async (req: Request, res: Response) => {
    const {noteId, status, rejectionReason} = req.body;
    const userId = req.userId;

    if (!noteId || !status) {
        return res.status(400).json({ message: "Note ID and status are required" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== "ADMIN") {
            return res.status(403).json({ message: "Not Authorized" });
        }
        const note = await prisma.note.findUnique({ where: { id: noteId } });
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        if (note.status === "APPROVED") {
            return res.status(400).json({ message: "Note already approved" });
        }
        if (note.status === "REJECTED") {
            return res.status(400).json({ message: "Note already rejected" });
        }
        const updatedNote = await prisma.note.update({
            where: { id: noteId },
            data: {
                status,
                reviewedBy: userId,
                rejectionReason: status === "REJECTED" ? rejectionReason : null
            }
        });
    } catch (error) {
        console.error("Error approving note:", error);
        return res.status(500).json({ message: "Server error: " + error });
    }
}

export const showNotesStatusToUploader = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const notes = await prisma.note.findMany({
            where: {
                uploaderId: userId
            }
        });

        return res.status(200).json({ notes });
    } catch (error) {
        console.error("Error fetching notes status:", error);
        return res.status(500).json({ message: "Server error: " + error });
    }
}

export const showPendingNotesToAdmin = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== "ADMIN") return res.status(404).json({ message: "User not found" });

        const notes = await prisma.note.findMany({
            where: {
                status: "PENDING",
            }
        });

        return res.status(200).json({ notes });
    } catch (error) {
        console.error("Error fetching pending notes:", error);
        return res.status(500).json({ message: "Server error: " + error });
    }
}

export const showNotesbySubject = async (req: Request, res: Response) => {
    const { semester, subject } = req.params;

    if (!semester || !subject) {
        return res.status(400).json({ message: "Semester and subject are required" });
    }

    try {
        const notes = await prisma.note.findMany({
            where: {
                semester: parseInt(semester),
                subject,
                status: "APPROVED"
            },
            include: {
                uploader: {
                    select: {
                        username: true,
                        profilePic: true
                    }
                }
            }
        });

        return res.status(200).json({ notes });
    } catch (error) {
        console.error("Error fetching notes by subject:", error);
        return res.status(500).json({ message: "Server error: " + error });
    }
}