import api from '../config/api';
import { postFormData } from '../config/apiUtils';

export const seniorService = {
  createRequest: async (data: FormData) => {
    return postFormData('/senior-request/create', data);
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