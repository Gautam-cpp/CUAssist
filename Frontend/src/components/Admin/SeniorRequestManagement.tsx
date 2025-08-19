import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { seniorService } from '../../services/seniorService';
import type { User } from '../../types';
import { ArrowLeft, UserPlus, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const SeniorRequestManagement: React.FC = () => {
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await seniorService.getPendingRequests() as { pendingRequests: User[] };
      setRequests(response.pendingRequests);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (userId: string, action: 'APPROVE' | 'REJECT') => {
    setProcessing(userId);
    try {
      await seniorService.approveRejectRequest({ userId, action });
      toast.success(`Request ${action.toLowerCase()}d successfully`);
      setRequests(requests.filter(request => request.id !== userId));
    } catch (error) {
      toast.error('Failed to update request status');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
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
        <h1 className="text-3xl font-bold text-gray-900">Senior Request Management</h1>
      </div>

      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <UserPlus className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {request.username}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">UID:</span> {request.UID}
                      </div>
                      <div>
                        <span className="font-medium">Current Role:</span>{' '}
                        <span className="capitalize">{request.role.toLowerCase()}</span>
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{' '}
                        <span className="capitalize text-yellow-600">
                          {request.seniorApplicationStatus?.toLowerCase()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Note: In a real implementation, you'd fetch the full application details including experience and resume */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Application Details:</span> View full application including 
                        experience details and resume by clicking the preview button.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApproveReject(request.id, 'APPROVE')}
                    disabled={processing === request.id}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleApproveReject(request.id, 'REJECT')}
                    disabled={processing === request.id}
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
          <UserPlus className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No pending senior requests to review</p>
        </div>
      )}
    </div>
  );
};

export default SeniorRequestManagement;