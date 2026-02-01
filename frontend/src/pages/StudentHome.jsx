import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Badge, Card, Skeleton, Button } from '../components/UI';
import { TopNav } from '../components/Navbars';
import BottomNav from '../components/BottomNav';
import ComplaintCard from '../components/ComplaintCard';
import NewComplaintModal from '../components/NewComplaintModal';
import complaintService from '../services/complaint.service';

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
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-24 md:pl-24 transition-all duration-300">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {activeTab === 'home' ? 'Campus Feed' : 'My Posts'}
          </h2>
        </div>

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        )}

        {activeTab === 'home' ? (
          <div className="space-y-5">
            {!loading && feed.length === 0 ? (
              <div className="text-center py-16 bg-surface rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg font-medium">No active complaints.</p>
                <p className="text-gray-400 text-sm mt-1">Complaints will appear here once submitted.</p>
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
          <div className="space-y-5">
            <Button
              onClick={() => setShowModal(true)}
              className="w-full py-3 shadow-lg shadow-brand/20"
            >
              + Create New Complaint
            </Button>

            {feed.filter((f) => f.authorId === user?.id).length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No posts yet.</p>
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
