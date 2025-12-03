import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function TopNav() {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link to={isAdmin ? '/admin' : '/'} className="font-semibold text-gray-900">Campus Voice</Link>
        <nav className="flex items-center gap-4 text-sm">
          {isAdmin ? (
            <Link to="/admin" className={location.pathname === '/admin' ? 'text-brand' : 'text-gray-600 hover:text-gray-900'}>Dashboard</Link>
          ) : (
            <Link to="/" className={location.pathname === '/' ? 'text-brand' : 'text-gray-600 hover:text-gray-900'}>Feed</Link>
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

