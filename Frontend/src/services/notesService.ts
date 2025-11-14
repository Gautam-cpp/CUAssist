import api from '../config/api';
import { postFormData } from '../config/apiUtils';
import type { Note } from '../types';

export const notesService = {
  uploadNotes: async (data: FormData) => {
    return postFormData('/notes/upload', data);
  },

  getUserNotesStatus: async (): Promise<{ notes: Note[] }> => {
    const response = await api.get('/notes/user/status');
    return response.data as { notes: Note[] };
  },

  getNotesBySubject: async (semester: number, subject: string): Promise<{ notes: Note[] }> => {
    const response = await api.get(`/notes/subject/${semester}/${subject}`);
    return response.data as { notes: Note[] } ;
  },

  getPendingNotes: async (): Promise<{ notes: Note[] }> => {
    const response = await api.get('/notes/admin/pending');
    return response.data as { notes: Note[] };
  },

  approveRejectNote: async (data: {
    noteId: string;
    status: 'APPROVED' | 'REJECTED';
    rejectionReason?: string;
  }) => {
    const response = await api.post('/notes/admin/approval', data);
    return response.data;
  },
};