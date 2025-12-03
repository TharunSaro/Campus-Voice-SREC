import React from 'react';
import { TopNav, BottomNav } from '../components/Navbars';
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
          
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Edit Profile</div>
              <div className="text-sm text-gray-600">Update your personal information</div>
            </button>
            
            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium text-gray-900">Settings</div>
              <div className="text-sm text-gray-600">Manage your preferences</div>
            </button>
            
            <button 
              onClick={logout}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors mt-4"
            >
              <div className="font-medium">Logout</div>
            </button>
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

