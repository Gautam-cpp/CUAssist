export interface User {
  id: string;
  username: string;
  UID: string;
  password?: string;
  profilePic?: string;
  role: 'STUDENT' | 'ADMIN' | 'SENIOR';
  isVerified: boolean;
  OTP?: string;
  OTPRequestedAt?: string;
  OTPExpiry?: string;
  seniorApplicationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_APPLIED';
}

export interface AuthResponse {
  token: string;
  username: string;
  role: 'STUDENT' | 'ADMIN' | 'SENIOR';
  profilePic?: string;
}

export interface Senior {
  id: string;
  userId: string;
  user?: User;
  experience: string;
  resumeUrl: string;
}

export interface Message {
  id: string;
  message: string;
  senderId: string;
  sender: {
    id: string;
    username: string;
    profilePic?: string;
    role: 'STUDENT' | 'ADMIN' | 'SENIOR';
  };
  replyToId?: string;
  replyTo?: {
    id: string;
    message: string;
    sender: {
      username: string;
    };
  };
  replies?: Message[];
  createdAt: string;
  _count: {
    replies: number;
  };
}

export interface Item {
  id: string;
  title: string;
  description?: string;
  contactDetails: string;
  price: number;
  imageUrl?: string;
  status: 'AVAILABLE' | 'SOLD' | 'FORRENT';
  daysToRent?: number;
  ownerId: string;
  owner?: User;
  createdAt: string;
}

export interface ItemRequest {
  id: number; // Note: This uses autoincrement Int in schema
  itemName: string;
  description: string;
  contactDetails: string;
  imageUrl?: string;
  requesterId: string;
  requester?: User;
  createdAt: string;
}

export interface Canteen {
  id: number; // Note: This uses autoincrement Int in schema
  canteenName: string;
  menuUrl?: string;
  reviews?: CanteenReview[];
}

export interface CanteenReview {
  id: number; // Note: This uses autoincrement Int in schema
  rating: number;
  messageReview: string;
  foodTried: string;
  userId: string;
  user: {
    username: string;
    profilePic?: string;
  };
  canteenId: number;
  canteen?: Canteen;
  createdAt: string;
}

export interface Note {
  id: number; // Note: This uses autoincrement Int in schema
  pdfName: string;
  semester: number;
  subject: string;
  fileUrl: string;
  uploaderId: string;
  uploader?: {
    username: string;
    profilePic?: string;
  };
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewedBy?: string;
  reviewer?: User;
  rejectionReason?: string;
}

export interface SeniorRequest {
  id: string;
  userId: string;
  user?: User;
  experience: string;
  resumeUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_APPLIED';
  createdAt: string;
}
