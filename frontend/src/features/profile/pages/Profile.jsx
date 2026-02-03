import React from 'react';
import { TopNav } from '../../../components/Navbars';
import BottomNav from '../../../components/BottomNav';
import { Card, Button } from '../../../components/UI';
import { useAuth } from '../../../context/AuthContext';
import { LogOut, User, Mail, Hash, Building, BookOpen, Phone } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-24 md:pl-24 transition-all duration-300">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Your Profile</h1>

        <Card className="shadow-neu-flat overflow-hidden">
          <div className="bg-gradient-to-r from-brand to-brand-light h-32 relative">
            <div className="absolute -bottom-10 left-6 p-1 bg-surface rounded-full">
              <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-white flex items-center justify-center text-slate-500 font-bold text-3xl shadow-md">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>

          <div className="pt-12 px-6 pb-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'User Name'}</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-gray-500 text-sm">{user?.email || 'email@example.com'}</p>
                <span className="inline-block h-1 w-1 bg-gray-300 rounded-full"></span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-brand/10 text-brand uppercase tracking-wide">
                  {user?.role || 'Student'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 space-y-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Personal Details</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-50 text-gray-400">
                    <Hash size={18} />
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs">Register Number</span>
                    <span className="font-medium text-gray-900 block mt-0.5">{user?.reg_no || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-50 text-gray-400">
                    <User size={18} />
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs">Gender</span>
                    <span className="font-medium text-gray-900 block mt-0.5">{user?.gender || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-50 text-gray-400">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs">Department</span>
                    <span className="font-medium text-gray-900 block mt-0.5">{user?.department || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-50 text-gray-400">
                    <Building size={18} />
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs">Stay Type</span>
                    <span className="font-medium text-gray-900 block mt-0.5 capitalize">{user?.stay_type || 'N/A'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gray-50 text-gray-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs">Phone Number</span>
                    <span className="font-medium text-gray-900 block mt-0.5">{user?.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <Button
                  onClick={logout}
                  variant="danger"
                  className="w-full flex items-center justify-center gap-2 py-3"
                >
                  <LogOut size={18} />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
      {user?.role === 'student' && <BottomNav />}
    </div>
  );
}

