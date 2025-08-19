import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { notesService } from '../../services/notesService';
import { Upload, FileText, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const NotesUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const selectedFile = watch('pdf')?.[0];

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('pdfName', data.pdfName);
      formData.append('semester', data.semester);
      formData.append('subject', data.subject);
      formData.append('pdf', data.pdf[0]);

      await notesService.uploadNotes(formData);
      toast.success('Notes uploaded successfully! Pending admin approval.');
      navigate('/notes/my-uploads');
    } catch (error) {
      toast.error('Failed to upload notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/notes')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Upload Notes</h1>
      </div>

      <div className="bg-blue-50 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <FileText className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900">Upload Guidelines</h3>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Upload clear, readable PDF files only</li>
              <li>• Use descriptive names for your notes</li>
              <li>• All uploads require admin approval</li>
              <li>• Help fellow students by sharing quality content</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes Title *
            </label>
            <input
              {...register('pdfName', { required: 'Notes title is required' })}
              type="text"
              placeholder="e.g., Data Structures - Chapter 1-5 Notes"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.pdfName && (
              <p className="mt-1 text-sm text-red-600">{errors.pdfName.message as string}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester *
              </label>
              <select
                {...register('semester', { required: 'Semester is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
              {errors.semester && (
                <p className="mt-1 text-sm text-red-600">{errors.semester.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Code *
              </label>
              <input
                {...register('subject', { required: 'Subject is required' })}
                type="text"
                placeholder="e.g., CS, MATH, PHY"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message as string}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF File *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                {...register('pdf', {
                  required: 'PDF file is required',
                  validate: {
                    fileType: (files) => {
                      if (!files[0]) return true;
                      return files[0].type === 'application/pdf' || 'Only PDF files are allowed';
                    },
                    fileSize: (files) => {
                      if (!files[0]) return true;
                      return files[0].size <= 10 * 1024 * 1024 || 'File size must be less than 10MB';
                    },
                  },
                })}
                type="file"
                accept=".pdf"
                className="hidden"
                id="pdf-upload"
              />
              <label htmlFor="pdf-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {selectedFile ? selectedFile.name : 'Click to upload PDF'}
                </p>
                <p className="text-sm text-gray-500">
                  Maximum file size: 10MB
                </p>
              </label>
            </div>
            {errors.pdf && (
              <p className="mt-1 text-sm text-red-600">{errors.pdf.message as string}</p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/notes')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Notes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotesUpload;