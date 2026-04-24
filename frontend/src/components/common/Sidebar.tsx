import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  MapPin,
  Calendar,
  Ticket,
  BarChart3,
  Settings,
  Trophy,
  ShieldAlert,
  Activity
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Players', href: '/players', icon: UserCheck },
  { name: 'Stadiums', href: '/stadiums', icon: MapPin },
  { name: 'Matches', href: '/matches', icon: Calendar },
  { name: 'Tickets', href: '/tickets', icon: Ticket },
  { name: 'Tournament', href: '/tournament', icon: Trophy },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 overflow-y-auto">
      <div className="p-6">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 shadow-lg shadow-purple-500/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-500' : ''}`} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}

          {user?.role === 'admin' && (
            <>
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Administration
                </p>
                <button
                  onClick={() => navigate('/admin/users')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    location.pathname === '/admin/users'
                      ? 'bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 text-red-600 dark:text-red-400 shadow-lg shadow-red-500/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <ShieldAlert className={`w-5 h-5 ${location.pathname === '/admin/users' ? 'text-red-500' : ''}`} />
                  <span className="font-medium">User Management</span>
                  {location.pathname === '/admin/users' && (
                    <div className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </button>
                <button
                  onClick={() => navigate('/admin/audit-logs')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 mt-2 ${
                    location.pathname === '/admin/audit-logs'
                      ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 shadow-lg shadow-purple-500/10'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Activity className={`w-5 h-5 ${location.pathname === '/admin/audit-logs' ? 'text-purple-500' : ''}`} />
                  <span className="font-medium">Audit Logs</span>
                  {location.pathname === '/admin/audit-logs' && (
                    <div className="ml-auto w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  )}
                </button>
              </div>
            </>
          )}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;