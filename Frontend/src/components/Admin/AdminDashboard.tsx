import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notesService } from '../../services/notesService';
import { seniorService } from '../../services/seniorService';
import { useAuth } from '../../context/useAuth';
import {
  Shield,
  FileText,
  Users,

  UserPlus,
  UtensilsCrossed,
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [pendingNotes, setPendingNotes] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingCounts();
  }, []);

  const fetchPendingCounts = async () => {
    try {
      const [notesResponse, requestsResponse] = await Promise.allSettled([
        notesService.getPendingNotes(),
        seniorService.getPendingRequests(),
      ]);

      if (notesResponse.status === 'fulfilled') {
        setPendingNotes(notesResponse.value.notes.length);
      }

      if (requestsResponse.status === 'fulfilled') {
        setPendingRequests((requestsResponse.value as any)?.pendingRequests?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching pending counts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="text-center py-12">
        <Shield className="h-12 w-12 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-600">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const adminActions = [
    {
      name: 'Pending Notes',
      description: 'Review and approve/reject submitted notes',
      href: '/admin/notes',
      icon: FileText,
      color: 'bg-blue-500 hover:bg-blue-600',
      count: pendingNotes,
    },
    {
      name: 'Senior Requests',
      description: 'Review senior membership applications',
      href: '/admin/senior-requests',
      icon: UserPlus,
      color: 'bg-purple-500 hover:bg-purple-600',
      count: pendingRequests,
    },
    {
      name: 'Upload Menu',
      description: 'Upload and manage canteen menus',
      href: '/admin/canteen-menu',
      icon: UtensilsCrossed,
      color: 'bg-orange-500 hover:bg-orange-600',
      count: null,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-red-100 text-lg">
          Manage platform content and user requests
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Notes</p>
              <p className="text-2xl font-bold text-blue-600">
                {loading ? '...' : pendingNotes}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Senior Applications</p>
              <p className="text-2xl font-bold text-purple-600">
                {loading ? '...' : pendingRequests}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <UserPlus className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-green-600">2,500+</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.href}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 relative"
              >
                {action.count !== null && action.count > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                    {action.count}
                  </div>
                )}
                
                <div className={`inline-flex p-3 rounded-lg ${action.color} transition-colors`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="mt-4 font-semibold text-gray-900 group-hover:text-gray-700">
                  {action.name}
                </h3>
                
                <p className="mt-2 text-sm text-gray-600">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">New notes pending approval</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Senior application received</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">Menu updated for Main Canteen</p>
                <p className="text-xs text-gray-500">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;