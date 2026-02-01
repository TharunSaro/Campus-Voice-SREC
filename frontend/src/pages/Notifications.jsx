import React from 'react';
import { TopNav } from '../components/Navbars';
import BottomNav from '../components/BottomNav';
import { Card } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { Bell } from 'lucide-react';

export default function Notifications() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-24 md:pl-24 transition-all duration-300">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">Notifications</h1>

        <Card className="p-12 text-center shadow-neu-flat flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <Bell size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
          <p className="text-gray-500 mt-2 max-w-sm">You have no new notifications at the moment. When your complaints are updated, they will appear here.</p>
        </Card>
      </div>
      {user?.role === 'student' && <BottomNav />}
    </div>
  );
}


