import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notesService } from '../../services/notesService';
import type { Note } from '../../types';
import { ArrowLeft, FileText, Check, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const NotesManagement: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingNotes();
  }, []);

  const fetchPendingNotes = async () => {
    try {
      const response = await notesService.getPendingNotes();
      setNotes(response.notes);
    } catch (error) {
      console.error('Error fetching pending notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (
    noteId: string,
    status: 'APPROVED' | 'REJECTED',
    rejectionReason?: string
  ) => {
    setProcessing(noteId);
    try {
      await notesService.approveRejectNote({
        noteId,
        status,
        rejectionReason,
      });
      toast.success(`Note ${status.toLowerCase()} successfully`);
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      toast.error('Failed to update note status');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = (noteId: string) => {
    const reason = prompt('Please provide a rejection reason:');
    if (reason) {
      handleApproveReject(noteId, 'REJECTED', reason);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/admin"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Notes Management</h1>
      </div>

      {notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {note.pdfName}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Semester:</span> {note.semester}
                      </div>
                      <div>
                        <span className="font-medium">Subject:</span> {note.subject}
                      </div>
                      <div>
                        <span className="font-medium">Uploaded:</span>{' '}
                        {new Date(note.createdAt).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{' '}
                        <span className="capitalize text-yellow-600">{note.status.toLowerCase()}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <a
                        href={note.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="h-4 w-4" />
                        <span>Preview PDF</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproveReject(note.id, 'APPROVED')}
                    disabled={processing === note.id}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(note.id)}
                    disabled={processing === note.id}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No pending notes to review</p>
        </div>
      )}
    </div>
  );
};

export default NotesManagement;