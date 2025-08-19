import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  Home,
  UtensilsCrossed,
  BookOpen,
  MessageCircle,
  UserPlus,

  Shield,

} from 'lucide-react';

const Navigation: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['STUDENT', 'ADMIN', 'SENIOR'] },
    { name: 'Canteens', href: '/canteens', icon: UtensilsCrossed, roles: ['STUDENT', 'ADMIN', 'SENIOR'] },
    { name: 'Notes', href: '/notes', icon: BookOpen, roles: ['STUDENT', 'ADMIN', 'SENIOR'] },
    { name: 'Guidance', href: '/guidance', icon: MessageCircle, roles: ['STUDENT', 'ADMIN', 'SENIOR'] },
    { name: 'Senior Request', href: '/senior-request', icon: UserPlus, roles: ['STUDENT'] },
    { name: 'Admin Panel', href: '/admin', icon: Shield, roles: ['ADMIN'] },
  ];

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(user?.role || 'STUDENT')
  );

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 overflow-x-auto">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;