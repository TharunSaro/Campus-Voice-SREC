import React from 'react';
import { TopNav, BottomNav } from '../components/Navbars';

export default function MyComplaints() {
  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-20">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">My Complaints</h1>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <p className="text-gray-600">You haven't submitted any complaints yet.</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}

