import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Badge, Card, Skeleton } from '../components/UI';
import { TopNav } from '../components/Navbars';
import BottomNav from '../components/BottomNav';
import ComplaintCard from '../components/ComplaintCard';
import NewComplaintModal from '../components/NewComplaintModal';

const CATEGORIES = ['Hostel', 'Mess', 'Academics', 'Infrastructure', 'Transport', 'Other'];

const initialFeed = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: [
    'Wi-Fi issues in hostel',
    'Mess food quality',
    'Classroom projector broken',
    'Bus delay on Route 3',
  ][i % 4],
  category: CATEGORIES[i % CATEGORIES.length],
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus.',
  timestamp: new Date(Date.now() - i * 3600_000).toISOString(),
  status: ['Open', 'In Progress', 'Resolved'][i % 3],
  upvotes: Math.floor(Math.random() * 120),
  authorId: i % 2 === 0 ? 1 : 2, // sample user IDs
  image: '/placeholder.png'
}));

export default function StudentHome() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState(initialFeed);
  const [activeTab, setActiveTab] = useState('home'); // home / posts
  const [showModal, setShowModal] = useState(false);

  const handleNewComplaint = (newComplaint) => {
    setFeed([newComplaint, ...feed]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className="max-w-5xl mx-auto p-4 sm:p-6 pb-20 md:pl-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {activeTab === 'home' ? 'Campus Feed' : 'My Posts'}
          </h2>
          <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">
            Logout
          </button>
        </div>

        {loading && (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        )}

        {activeTab === 'home' ? (
          <div className="space-y-3">
            {feed.map((item) => (
              <ComplaintCard key={item.id} complaint={item} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => setShowModal(true)}
              className="w-full bg-brand text-white py-2 rounded-lg font-medium hover:bg-brand-dark"
            >
              + Create New Complaint
            </button>

            {feed.filter((f) => f.authorId === user?.id).length === 0 ? (
              <p className="text-gray-600 text-center mt-6">No posts yet.</p>
            ) : (
              feed
                .filter((f) => f.authorId === user?.id)
                .map((item) => <ComplaintCard key={item.id} complaint={item} />)
            )}
          </div>
        )}
      </div>

      <NewComplaintModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleNewComplaint}
      />

      {user?.role === 'student' && (
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}
