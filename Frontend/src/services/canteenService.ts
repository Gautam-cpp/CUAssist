import api from '../config/api';
import type { CanteenReview } from '../types';

export const canteenService = {
  uploadMenu: async (data: FormData) => {
    const response = await api.post('/canteen/upload-menu', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getMenu: async (canteenName: string) => {
    const response = await api.get(`/canteen/menu/${canteenName}`);
    return response.data;
  },

  addReview: async (data: {
    canteenName: string;
    rating: number;
    messageReview: string;
    foodTried: string;
  }) => {
    const response = await api.post('/canteen/add-review', data);
    return response.data;
  },

  getReviews: async (canteenName: string): Promise<CanteenReview[]> => {
    const response = await api.get(`/canteen/reviews/${canteenName}`);
    return response.data as CanteenReview[];
  },
};