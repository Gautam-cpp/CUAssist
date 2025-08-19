import api from '../config/api';

export const seniorService = {
  createRequest: async (data: FormData) => {
    const response = await api.post('/senior-request/create', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getPendingRequests: async () => {
    const response = await api.get('/senior-request/pending');
    return response.data;
  },

  approveRejectRequest: async (data: {
    userId: string;
    action: 'APPROVE' | 'REJECT';
  }) => {
    const response = await api.post('/senior-request/status', data);
    return response.data;
  },
};