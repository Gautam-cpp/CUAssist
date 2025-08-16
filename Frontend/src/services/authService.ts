import api from '../config/api';
import type { AuthResponse } from '../types';

export const authService = {
  signup: async (data: {
    username: string;
    UID: string;
    password: string;
    role?: 'STUDENT' | 'ADMIN' | 'SENIOR';
  }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (data: { UID: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data as AuthResponse;
  },

  verifyOTP: async (data: { UID: string; otp: string }) => {
    const response = await api.post('/otp/verify', data);
    return response.data as AuthResponse;
  },

  resendOTP: async (data: { UID: string }) => {
    const response = await api.post('/otp/resend-otp', data);
    return response.data as AuthResponse;
  },
};