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
  const [imagePreview, setImagePreview] = useState(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "campus_voice_unsigned");
    data.append("folder", "campus_voice/complaints");

    try {
      console.log("Starting Cloudinary upload..."); // Debug log
      const res = await fetch("https://api.cloudinary.com/v1_1/dl8oqrw3e/image/upload", {
        method: "POST",
        body: data,
        // mode: 'cors', // Optional, usually default
        // Headers are automatically set by browser for FormData (do NOT set Content-Type)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Cloudinary Error Details:", errorData);
        throw new Error(`Image upload failed: ${errorData.error?.message || res.statusText}`);
      }

      const json = await res.json();
      console.log("Cloudinary Upload Success:", json); // Debug log
      return json.secure_url;
    } catch (error) {
      console.error("Cloudinary Upload Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchMyComplaints = async () => {
      if (activeTab === 'mine' && user?.reg_no) {
        try {
          const response = await complaintService.getMyComplaints(user.reg_no);
          console.log("My Posts API Response:", response);

          if (Array.isArray(response)) {
            setMyPosts(response);
          } else if (response && Array.isArray(response.complaints)) {
            setMyPosts(response.complaints);
          } else if (response && Array.isArray(response.data)) {
            setMyPosts(response.data);
          } else {
            console.error("Unexpected format for My Posts:", response);
            setMyPosts([]);
          }
        } catch (error) {
          console.error("Failed to fetch complaints:", error);
          setMyPosts([]);
        }
      }
    };

    fetchMyComplaints();
  }, [activeTab, user?.reg_no]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description) {
      alert('Title and Description are required.');
      return;
    }

    // Public complaints MUST have an image
    if (formData.visibility === 'public' && !formData.image) {
      alert('Image upload is mandatory for public complaints.');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = '';
      if (formData.image) {
        imageUrl = await uploadToCloudinary(formData.image);
      }

      const payload = {
        name: user?.name,
        register_number: user?.reg_no,
        department: user?.department,
        stay_type: user?.stay_type,
        visibility: formData.visibility === 'public' ? 'Public' : 'Private',
        title: formData.title,
        description: formData.description,
        image_url: imageUrl,
      };

      const response = await complaintService.createComplaint(payload);

      setApiResponse(response);
      setSubmitted(true);

      const newPost = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toLocaleString(),
        ...response,
        image_url: imageUrl // Ensure local update shows proper image
      };
      setMyPosts([newPost, ...myPosts]);

      setFormData({
        title: '',
        description: '',
        image: null,
        visibility: 'public',
        skipEscalation: false,
      });
      setImagePreview(null);

    } catch (error) {
      console.error(error);
      alert(error.message || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success screen with AI Response
  if (submitted && apiResponse) {
    return (
      <div className="fixed inset-0 z-50 min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full mx-auto p-8 bg-white rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
          {/* Animated Success Circle */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Submitted!</h2>
            <p className="text-gray-600">AI has analyzed your complaint.</p>
          </div>

          <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Status</span>
                <p className="font-semibold text-gray-900">{apiResponse.status || 'Pending'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Category</span>
                <p className="font-medium text-blue-600">{apiResponse.category || '-'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Priority</span>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mt-1
                     ${apiResponse.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {apiResponse.priority || 'Normal'}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Assigned To</span>
                <p className="font-medium text-gray-900">{apiResponse.assigned_to || 'Admin'}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200">
              <span className="text-xs text-gray-500 uppercase tracking-wide">AI Summary</span>
              <p className="text-sm text-gray-700 mt-1 italic">"{apiResponse.summary || 'No summary available.'}"</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSubmitted(false);
              setApiResponse(null);
              navigate('/home');
            }}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            Go to Home
          </button>
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
                  onChange={handleImageChange}
                  required={formData.visibility === 'public'}
                  className={`w-full border rounded-lg px-3 py-2 bg-gray-50 ${formData.visibility === 'public' && !formData.image ? 'border-blue-300' : ''
                    }`}
                />

                {imagePreview && (
                  <div className="mt-2 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-40 w-full object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, image: null });
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                      title="Remove Image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
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
            {(!Array.isArray(myPosts) || myPosts.length === 0) ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No complaints submitted yet.</p>
              </Card>
            ) : (
              myPosts.map((post) => {
                const dateStr = post.submitted_at || post.created_at || post.createdAt;
                const isValidDate = dateStr && !isNaN(new Date(dateStr).getTime());

                return (
                  <Card key={post.id || post.complaint_id || Math.random()} className="p-5">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {post.title}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold
                        ${post.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                          post.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                        {post.status || 'Pending'}
                      </span>
                    </div>

                    <div className="text-xs text-gray-400 mt-1 mb-2">
                      Submitted on: {isValidDate ? new Date(dateStr).toLocaleString() : 'Date unavailable'}
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed mb-3">{post.description}</p>

                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt="Grievance"
                        className="w-full rounded-lg object-cover max-h-64 mb-3"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    )}

                    <div className="flex flex-wrap gap-4 text-xs text-gray-600 pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Category:</span> {post.category || 'Uncategorized'}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Priority:</span> {post.priority || 'Normal'}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Visibility:</span> <span className="capitalize">{post.visibility || 'Public'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">Assigned To:</span> {post.assigned_authority || 'Pending Assignment'}
                      </div>
                      <div className="flex items-center gap-3 ml-auto">
                        <span className="flex items-center gap-1 text-green-600">
                          👍 {post.upvotes || 0}
                        </span>
                        <span className="flex items-center gap-1 text-red-600">
                          👎 {post.downvotes || 0}
                        </span>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>

      {user?.role === 'student' && <BottomNav />}
    </div>
  );
}
