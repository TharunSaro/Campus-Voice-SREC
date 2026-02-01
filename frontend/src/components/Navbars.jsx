import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function TopNav() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  // Student pages that should show notification bell
  const studentPages = ['/home', '/posts', '/profile'];
  const showNotificationBell = isStudent && studentPages.includes(location.pathname);

  return (
    <div className="sticky top-0 z-30 bg-surface shadow-sm border-b border-accent/20">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-light to-brand flex items-center justify-center text-white font-bold shadow-md shadow-brand/20 group-hover:scale-105 transition-transform">
            CV
          </div>
          <span className="font-bold text-gray-900 tracking-tight text-lg group-hover:text-brand transition-colors">CampusVoice</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          {isAdmin ? (
            <Link to="/admin" className={location.pathname === '/admin' ? 'text-brand' : 'text-gray-500 hover:text-gray-900'}>Dashboard</Link>
          ) : (
            <>
              {showNotificationBell && (
                <button
                  onClick={() => navigate('/notifications')}
                  className="relative p-2 rounded-full text-gray-500 hover:bg-brand/5 hover:text-brand transition-all duration-200"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {/* Notification badge - uncomment if you have notification count */}
                  {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span> */}
                </button>
              )}
            </>
          )}
        </nav>
      </div>
    </div>
  );
}

export function AdminSidebar({ children }) {
  return (
    <div className="min-h-screen sm:grid sm:grid-cols-[220px_1fr]">
      <aside className="hidden sm:block border-r border-gray-100 p-4">
        <div className="font-semibold text-gray-900 mb-4">Campus Voice</div>
        <nav className="space-y-2 text-sm">
          <Link to="/admin" className="block text-gray-600 hover:text-gray-900">Dashboard</Link>
        </nav>
      </aside>
      <main>{children}</main>
    </div>
  );
}
