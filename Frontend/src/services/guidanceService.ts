import api from '../config/api';
import type { Message } from '../types';

export const guidanceService = {
  sendMessage: async (data: { content: string; replyToId?: string }) => {
    const response = await api.post('/guidance/msg', data);
    return response.data;
  },

  getMessages: async (page: number = 1, limit: number = 20): Promise<Message[]> => {
    const response = await api.get(`/guidance/msgs?page=${page}&limit=${limit}`);
    return response.data as Message[];
  },
};