import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import cloudinary from "../utils/cloudinaryConfig";

export const createSeniorRequest = async (req: Request, res: Response) => {
    const {experience} = req.body
    const userId = req.userId;
    const resume = req.file;

    if(!resume || !experience){
        return res.status(400).json({ error: "Please provide all required fields." });
    }

    try{
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if(!user){
            return res.status(404).json({ error: "User not found." });
        }

        if(user.seniorApplicationStatus === "PENDING" || user.seniorApplicationStatus === "APPROVED"){
            return res.status(400).json({ error: "You have already submitted a senior request." });
        }

        const {secure_url: resumeUrl} = await cloudinary.uploader.upload(resume.path, {
            resource_type: "auto",
            folder: "resumes"
        });

        await prisma.user.update({
            where: { id: userId },
            data: { seniorApplicationStatus: "PENDING" }
        });

        const newRequest = await prisma.senior.create({
            data: {
                userId,
                experience,
                resumeUrl
            },
        });

        return res.status(201).json({ message: "Senior request created successfully.", request: newRequest });

    } catch(error){
        console.error("Error creating senior request:", error);
        return res.status(500).json({ error: "Server error: " + error });

    }

}

// ADMiN

export const pendingRequestToAdmin = async (req: Request, res: Response) => {
    const userId = req.userId;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== "ADMIN") {
            return res.status(404).json({ error: "User not Authorized." });
        }

        const pendingRequests = await prisma.user.findMany({
            where: {
                seniorApplicationStatus: "PENDING"
            }
        });

        return res.status(200).json({ pendingRequests });

    } catch (error) {
        console.error("Error fetching pending requests:", error);
        return res.status(500).json({ error: "Server error: " + error });
    }
}

export const approveRejectSeniorRequest = async (req: Request, res: Response) => {
    const { userId: requestUserId, action } = req.body;
    const adminUserId = req.userId;

    if (!requestUserId || !action) {
        return res.status(400).json({ error: "Request user ID and action are required." });
    }

    try {
        const adminUser = await prisma.user.findUnique({ where: { id: adminUserId } });
        if (!adminUser || adminUser.role !== "ADMIN") {
            return res.status(403).json({ error: "Not authorized." });
        }

        const requestUser = await prisma.user.findUnique({ where: { id: requestUserId } });
        if (!requestUser || requestUser.seniorApplicationStatus !== "PENDING") {
            return res.status(404).json({ error: "Request user not found or not pending." });
        }

        if (action === "APPROVE") {
            await prisma.user.update({
                where: { id: requestUserId },
                data: { seniorApplicationStatus: "APPROVED" }
            });
            return res.status(200).json({ message: "Senior request approved." });
        } else if (action === "REJECT") {
            await prisma.user.update({
                where: { id: requestUserId },
                data: { seniorApplicationStatus: "REJECTED" }
            });
            return res.status(200).json({ message: "Senior request rejected." });
        } else {
            return res.status(400).json({ error: "Invalid action." });
        }

    } catch (error) {
        console.error("Error approving/rejecting senior request:", error);
        return res.status(500).json({ error: "Server error: " + error });
    }
}