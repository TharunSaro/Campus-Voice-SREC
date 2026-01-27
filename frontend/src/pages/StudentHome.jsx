import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Badge, Card, Skeleton } from '../components/UI';
import { TopNav } from '../components/Navbars';
import BottomNav from '../components/BottomNav';
import ComplaintCard from '../components/ComplaintCard';
import NewComplaintModal from '../components/NewComplaintModal';
import complaintService from '../services/complaint.service';

const CATEGORIES = ['Hostel', 'Mess', 'Academics', 'Infrastructure', 'Transport', 'Other'];

const initialFeed = [];

export default function StudentHome() {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [feed, setFeed] = useState(initialFeed);
  const [activeTab, setActiveTab] = useState('home'); // home / posts
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchFeed = async () => {
      if (activeTab === 'home') {
        try {
          setLoading(true);
          const data = await complaintService.getPublicComplaints();
          console.log("Public Feed Data:", data);
          if (Array.isArray(data)) {
            setFeed(data);
          } else if (data && Array.isArray(data.complaints)) {
            setFeed(data.complaints);
          } else if (data && Array.isArray(data.data)) {
            setFeed(data.data);
          } else {
            console.error("API returned unexpected format:", data);
            setFeed([]);
          }
        } catch (error) {
          console.error("Failed to load feed:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFeed();
  }, [activeTab]);

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
            {feed.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No active complaints.</p>
                <p className="text-gray-400 text-sm">Complaints will appear here once submitted.</p>
              </div>
            ) : (
              feed.map((item) => (
                <ComplaintCard
                  key={item.id || item.complaint_id}
                  id={item.id || item.complaint_id}
                  title={item.title}
                  desc={item.description}
                  category={item.category}
                  img={item.image_url}
                  author={item.student_name}
                  status={item.status}
                  priority={item.priority}
                  upvotes={item.upvotes}
                  timestamp={item.submitted_at}
                />
              ))
            )}
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
                .map((item) => (
                  <ComplaintCard
                    key={item.id || item.complaint_id}
                    id={item.id || item.complaint_id}
                    title={item.title}
                    desc={item.description}
                    category={item.category}
                    img={item.image_url}
                    author={item.student_name}
                    status={item.status}
                    priority={item.priority}
                    upvotes={item.upvotes}
                    timestamp={item.submitted_at}
                  />
                ))
            )}
          </div>
        )}
      </div>

      <NewComplaintModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleNewComplaint}
      />

      {user?.role === 'student' && <BottomNav />}
    </div>
  );
}
