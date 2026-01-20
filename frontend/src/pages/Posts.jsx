import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/Navbars';
import BottomNav from '../components/BottomNav';
import { Card } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import complaintService from '../services/complaint.service';

export default function Posts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    visibility: 'public',
    skipEscalation: false,
  });
  const [myPosts, setMyPosts] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Public complaints MUST have an image
    if (formData.visibility === 'public' && !formData.image) {
      alert('Image upload is mandatory for public complaints.');
      return;
    }

    const newPost = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toLocaleString(),
    };

    setMyPosts([newPost, ...myPosts]);
    setFormData({
      title: '',
      description: '',
      image: null,
      visibility: 'public',
      skipEscalation: false,
    });

    // Show success screen
    setSubmitted(true);

    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';

    // Redirect to home after showing success message (5 seconds)
    setTimeout(() => {
      setSubmitted(false);
      navigate('/home');
    }, 5000);
  };

  // Success screen (GPay-style)
  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full mx-auto p-8 text-center bg-white rounded-2xl shadow-xl">
          {/* Animated Success Circle with Checkmark */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-32 h-32">
              {/* Outer Circle - animated drawing */}
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="339.292"
                  strokeDashoffset="339.292"
                  className="animate-drawCircle"
                />
              </svg>

              {/* Checkmark - appears after circle is drawn */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 animate-[fadeIn_0.3s_ease-out_0.6s_forwards]">
                <svg
                  className="w-16 h-16 text-green-600 animate-checkmark"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{
                    strokeDasharray: 40,
                    strokeDashoffset: 40
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={4}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Success Messages */}
          <div className="space-y-4 animate-fadeInDelay">
            <h2 className="text-2xl font-bold text-gray-900">
              Grievance Submitted Successfully!
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed">
              The complaint will be reviewed by AI and posted
            </p>

            <p className="text-base text-gray-600 leading-relaxed">
              Thank you for your feedback. Your voice helps make SREC a better place.
            </p>
          </div>

          {/* Loading indicator */}
          <div className="mt-8 animate-fadeInDelay">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              <span className="ml-2">Redirecting...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />

      {/* Page Content */}
      <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-20 md:pl-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>

          {/* Tabs */}
          <div className="flex bg-white rounded-full shadow-sm overflow-hidden border border-gray-200">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 text-sm font-medium transition ${activeTab === 'create'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              Create
            </button>
            <button
              onClick={() => setActiveTab('mine')}
              className={`px-4 py-2 text-sm font-medium transition ${activeTab === 'mine'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              My Posts
            </button>
          </div>
        </div>

        {/* --- Create Form --- */}
        {activeTab === 'create' && (
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter grievance title"
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your issue..."
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Visibility Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complaint Visibility
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={formData.visibility === 'public'}
                      onChange={handleChange}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Public Complaint</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={formData.visibility === 'private'}
                      onChange={handleChange}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Private Complaint</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.visibility === 'public'
                    ? "Visible to peers in the public feed."
                    : "Visible only to the assigned admin."}
                </p>
              </div>

              {/* Skip and Escalate - Only for Private */}
              {formData.visibility === 'private' && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="skipEscalation"
                    id="skipEscalation"
                    checked={formData.skipEscalation}
                    onChange={handleChange}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="skipEscalation" className="text-sm text-gray-700 cursor-pointer">
                    Skip and escalate to higher authority
                  </label>
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image {formData.visibility === 'public' ? '(Mandatory)' : '(Optional)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  required={formData.visibility === 'public'}
                  className={`w-full border rounded-lg px-3 py-2 bg-gray-50 ${formData.visibility === 'public' && !formData.image ? 'border-blue-300' : ''
                    }`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : 'Submit Grievance'}
              </button>
            </form>
          </Card>
        )}

        {/* --- My Posts --- */}
        {activeTab === 'mine' && (
          <div className="space-y-4">
            {myPosts.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500">You haven’t posted anything yet.</p>
              </Card>
            ) : (
              myPosts.map((post) => (
                <Card key={post.id} className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500">{post.createdAt}</p>
                  <p className="mt-2 text-gray-700">{post.description}</p>
                  <p className="mt-1 text-sm text-blue-600 font-medium capitalize">
                    {post.visibility} {post.skipEscalation ? '(Escalated)' : ''}
                  </p>
                  {post.image && (
                    <img
                      src={URL.createObjectURL(post.image)}
                      alt="Grievance"
                      className="mt-3 w-full rounded-lg object-cover max-h-64"
                    />
                  )}
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {user?.role === 'student' && <BottomNav />}
    </div>
  );
}
