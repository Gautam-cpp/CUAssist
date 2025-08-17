import React from 'react';
import { useAuth } from '../../context/useAuth';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  BookOpen,
  MessageCircle,
  UserPlus,
  Shield,
  Users,
  FileText,
  Star,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const quickActions = [
    {
      name: 'Browse Canteens',
      description: 'Check menus and reviews',
      href: '/canteens',
      icon: UtensilsCrossed,
      color: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      name: 'Study Notes',
      description: 'Access shared notes',
      href: '/notes',
      icon: BookOpen,
      color: 'bg-blue-500 hover:bg-blue-600',
    },
    {
      name: 'Get Guidance',
      description: 'Ask questions to seniors',
      href: '/guidance',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600',
    },
  ];

  if (user?.role === 'STUDENT') {
    quickActions.push({
      name: 'Become Senior',
      description: 'Apply for senior status',
      href: '/senior-request',
      icon: UserPlus,
      color: 'bg-purple-500 hover:bg-purple-600',
    });
  }

  if (user?.role === 'ADMIN') {
    quickActions.push({
      name: 'Admin Panel',
      description: 'Manage platform content',
      href: '/admin',
      icon: Shield,
      color: 'bg-red-500 hover:bg-red-600',
    });
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-b-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {getGreeting()}, {user?.username}!
        </h1>
        <p className="text-blue-100 text-lg">
          Welcome back to CU Hub. What would you like to do today?
        </p>
        <div className="mt-4 flex items-center space-x-4 text-blue-100">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span className="capitalize">{user?.role.toLowerCase()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Active Member</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.href}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
              >
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
                <p className="text-sm text-gray-900">Welcome to CU Hub!</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            <div className="text-center text-gray-500 py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Start using CU Hub to see your activity here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Active Users', value: '2,500+', color: 'text-blue-600' },
            { label: 'Study Notes', value: '1,200+', color: 'text-green-600' },
            { label: 'Canteen Reviews', value: '850+', color: 'text-orange-600' },
            { label: 'Guidance Posts', value: '600+', color: 'text-purple-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;