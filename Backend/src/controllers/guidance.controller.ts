import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { moderateMessage } from "../helper/moderationMsg";
import { broadcastMessage } from "../helper/broadcastMsg";

export const message = async (req: Request, res: Response) => {
    const { content, replyToId } = req.body;
    const userId = req.userId;

    if (!userId || !content) {
        return res.status(400).json({ error: "Missing userId or content" });
    }

    const isModerated: any = await moderateMessage(content);
    if (isModerated.moderation === "unsafe") {
        return res.status(400).json({ message: "Message content is unsafe" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: "User not found" });

        if (replyToId) {
            if (user.role !== "SENIOR") {
                return res.status(403).json({ message: "Only senior users can reply to messages" });
            }
            const replyToMessage = await prisma.message.findUnique({ where: { id: replyToId } });
            if (!replyToMessage) {
                return res.status(404).json({ error: "Reply message not found" });
            }
        }

        const newMessage = await prisma.message.create({
            data: {
                senderId: userId,
                message: content,
                replyToId: replyToId || null,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        profilePic: true,
                        role: true,
                    },
                },
                replyTo: {
                    select: {
                        id: true,
                        message: true,
                        sender: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
                _count: {
                    select: {
                        replies: true,
                    },
                },
            },
        });

        broadcastMessage(newMessage);
        return res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error creating message:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    const { page = 1, limit = 20 } = req.query;

    try {
        const messages = await prisma.message.findMany({
            where: { replyToId: null }, // Only get top-level messages
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            orderBy: {
                createdAt: "desc",
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                        profilePic: true,
                        role: true,
                    },
                },
                replyTo: {
                    select: {
                        id: true,
                        message: true,
                        sender: {
                            select: {
                                username: true,
                            },
                        },
                    },
                },
                replies: {
                    include: {
                        sender: {
                            select: {
                                id: true,
                                username: true,
                                profilePic: true,
                                role: true,
                            },
                        },
                        _count: {
                            select: {
                                replies: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: "asc",
                    },
                },
                _count: {
                    select: {
                        replies: true,
                    },
                },
            },
        });

        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
