export interface User {
  id: string;
  username: string;
  UID: string;
  role: 'STUDENT' | 'ADMIN' | 'SENIOR';
  profilePic?: string;
  isVerified: boolean;
  seniorApplicationStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: 'STUDENT' | 'ADMIN' | 'SENIOR';
  profilePic?: string;
}

export interface Canteen {
  id: string;
  canteenName: string;
  menuUrl?: string;
}

export interface CanteenReview {
  rating: number;
  messageReview: string;
  foodTried: string;
  user: {
    username: string;
    profilePic?: string;
  };
  createdAt: string;
}

export interface Note {
  id: string;
  pdfName: string;
  semester: number;
  subject: string;
  fileUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  uploader?: {
    username: string;
    profilePic?: string;
  };
  createdAt: string;
}

export interface Message {
  id: string;
  message: string;
  sender: {
    id: string;
    username: string;
    profilePic?: string;
  };
  replyTo?: {
    id: string;
    message: string;
    sender: {
      username: string;
    };
  };
  createdAt: string;
  _count: {
    replies: number;
  };
}

export interface SeniorRequest {
  id: string;
  userId: string;
  experience: string;
  resumeUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}