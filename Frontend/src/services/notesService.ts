import api from '../config/api';
import type { Note } from '../types';

export const notesService = {
  uploadNotes: async (data: FormData) => {
    const response = await api.post('/notes/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getUserNotesStatus: async (): Promise<{ notes: Note[] }> => {
    const response = await api.get('/notes/user/status');
    return response.data as { notes: Note[] };
  },

  getNotesBySubject: async (semester: number, subject: string): Promise<{ notes: Note[] }> => {
    const response = await api.get(`/notes/notes/${semester}/${subject}`);
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