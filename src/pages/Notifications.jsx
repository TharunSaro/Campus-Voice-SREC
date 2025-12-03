import React from 'react';
import { TopNav, BottomNav } from '../components/Navbars';
import { Card } from '../components/UI';

export default function Notifications() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-20 md:pl-20">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Notifications</h1>
        <Card className="p-8 text-center">
          <p className="text-gray-600">You're all caught up. (Placeholder)</p>
        </Card>
      </div>
      <BottomNav />
    </div>
  );
}


