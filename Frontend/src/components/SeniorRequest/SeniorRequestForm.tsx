import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/useAuth';
import { seniorService } from '../../services/seniorService';
import { UserPlus, Upload, ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SeniorRequestForm: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const selectedFile = watch('pdf')?.[0];

  const getApplicationStatus = () => {
    switch (user?.seniorApplicationStatus) {
      case 'PENDING':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          message: 'Your application is under review',
        };
      case 'APPROVED':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          message: 'Congratulations! Your application has been approved',
        };
      case 'REJECTED':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          message: 'Your application was not approved. You can apply again.',
        };
      default:
        return null;
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('experience', data.experience);
      formData.append('pdf', data.pdf[0]);

      await seniorService.createRequest(formData);
      toast.success('Senior application submitted successfully!');
      window.location.reload(); // Refresh to show updated status
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  const applicationStatus = getApplicationStatus();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Senior Application</h1>
          <p className="text-gray-600">Apply to become a senior member and help other students</p>
        </div>
      </div>

      {/* Application Status */}
      {applicationStatus && (
        <div className={`rounded-xl p-6 border ${applicationStatus.bg} ${applicationStatus.border}`}>
          <div className="flex items-start space-x-3">
            <applicationStatus.icon className={`h-6 w-6 ${applicationStatus.color} mt-1`} />
            <div>
              <h3 className={`font-semibold ${applicationStatus.color}`}>
                Application Status
              </h3>
              <p className={`mt-1 ${applicationStatus.color} opacity-90`}>
                {applicationStatus.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Application Form */}
      {(!user?.seniorApplicationStatus || user.seniorApplicationStatus === 'REJECTED') && (
        <>
          <div className="bg-purple-50 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <UserPlus className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <h3 className="font-semibold text-purple-900">Senior Membership Benefits</h3>
                <ul className="text-sm text-purple-800 mt-2 space-y-1">
                  <li>• Help guide junior students through their academic journey</li>
                  <li>• Reply to guidance forum questions</li>
                  <li>• Contribute to the university community</li>
                  <li>• Access to senior-exclusive features</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience & Qualifications *
                </label>
                <textarea
                  {...register('experience', { required: 'Please describe your experience' })}
                  rows={6}
                  placeholder="Tell us about your academic achievements, leadership experience, skills, and why you want to become a senior member..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                {errors.experience && (
                  <p className="mt-1 text-sm text-red-600">{errors.experience.message as string}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resume/CV *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                  <input
                    {...register('pdf', {
                      required: 'Resume is required',
                      validate: {
                        fileType: (files) => {
                          if (!files[0]) return true;
                          return files[0].type === 'application/pdf' || 'Only PDF files are allowed';
                        },
                        fileSize: (files) => {
                          if (!files[0]) return true;
                          return files[0].size <= 5 * 1024 * 1024 || 'File size must be less than 5MB';
                        },
                      },
                    })}
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      {selectedFile ? selectedFile.name : 'Upload your resume (PDF)'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Maximum file size: 5MB
                    </p>
                  </label>
                </div>
                {errors.pdf && (
                  <p className="mt-1 text-sm text-red-600">{errors.pdf.message as string}</p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Note:</span> All applications are reviewed by administrators. 
                  You will be notified of the decision via the platform. Please ensure all information is accurate.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </>
      )}

      {/* Success Message for Approved */}
      {user?.seniorApplicationStatus === 'APPROVED' && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome, Senior Member!</h3>
          <p className="text-gray-600 mb-6">
            You now have access to senior features. Visit the guidance forum to start helping other students.
          </p>
          <Link
            to="/guidance"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Go to Guidance Forum
          </Link>
        </div>
      )}
    </div>
  );
};

export default SeniorRequestForm;