import React from 'react';
import { TopNav } from '../components/Navbars';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-20 md:pl-20">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Profile</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name || 'User'}</h2>
              <p className="text-sm text-gray-600">{user?.email || ''}</p>
              <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                {user?.role || 'Student'}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Account Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="block text-gray-500 text-xs uppercase tracking-wide">Registration Number</span>
                <span className="font-medium text-gray-900">{user?.reg_no || '-'}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="block text-gray-500 text-xs uppercase tracking-wide">Full Name</span>
                <span className="font-medium text-gray-900">{user?.name || '-'}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="block text-gray-500 text-xs uppercase tracking-wide">Department</span>
                <span className="font-medium text-gray-900">{user?.department || '-'}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="block text-gray-500 text-xs uppercase tracking-wide">Gender</span>
                <span className="font-medium text-gray-900">{user?.gender || '-'}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="block text-gray-500 text-xs uppercase tracking-wide">Stay Type</span>
                <span className="font-medium text-gray-900">{user?.stay_type || '-'}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="block text-gray-500 text-xs uppercase tracking-wide">Phone Number</span>
                <span className="font-medium text-gray-900">{user?.phone || '-'}</span>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg md:col-span-2">
                <span className="block text-gray-500 text-xs uppercase tracking-wide">Email Address</span>
                <span className="font-medium text-gray-900">{user?.email || '-'}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors mt-6 border border-red-100 flex items-center justify-center font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
      {user?.role === 'student' && <BottomNav />}
    </div>
  );
}

