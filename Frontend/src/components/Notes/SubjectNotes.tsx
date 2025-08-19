import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { notesService } from '../../services/notesService';
import type { Note } from '../../types';
import { ArrowLeft, Download, User, Calendar, FileText } from 'lucide-react';
import { subjects } from '../../lib/subjects';

const SubjectNotes: React.FC = () => {
  const { semester, subject } = useParams<{ semester: string; subject: string }>();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const subjectName = subjects.find((sub) => sub.code === subject)?.name;

  useEffect(() => {
    if (semester && subject) {
      fetchNotes();
    }
  }, [semester, subject]);

  const fetchNotes = async () => {
    try {
      const response = await notesService.getNotesBySubject(
        parseInt(semester!),
        subject!
      );
      setNotes(response.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/notes"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {subjectName} Notes
          </h1>
          <p className="text-gray-600">Semester {semester}</p>
        </div>
      </div>

      {notes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <div key={note.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <FileText className="h-6 w-6 text-red-600" />
                </div>
                <a
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Download className="h-5 w-5" />
                </a>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                {note.pdfName}
              </h3>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{note.uploader?.username}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <a
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium text-center block"
                >
                  Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600 mb-4">No notes available for {subject}</p>
          <p className="text-sm text-gray-500 mb-6">
            Be the first to contribute notes for this subject!
          </p>
          <Link
            to="/notes/upload"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Upload Notes
          </Link>
        </div>
      )}
    </div>
  );
};

export default SubjectNotes;