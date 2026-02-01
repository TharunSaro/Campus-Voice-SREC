import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNav } from '../components/Navbars';
import BottomNav from '../components/BottomNav';
import { Card, Button } from '../components/UI';
import ComplaintCard from '../components/ComplaintCard';
import { useAuth } from '../context/AuthContext';
import complaintService from '../services/complaint.service';
import { Upload, X } from 'lucide-react';

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
      const res = await fetch("https://api.cloudinary.com/v1_1/dl8oqrw3e/image/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`Image upload failed: ${errorData.error?.message || res.statusText}`);
      }

      const json = await res.json();
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
          if (Array.isArray(response)) {
            setMyPosts(response);
          } else if (response && Array.isArray(response.complaints)) {
            setMyPosts(response.complaints);
          } else if (response && Array.isArray(response.data)) {
            setMyPosts(response.data);
          } else {
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

    if (!formData.title || !formData.description) {
      alert('Title and Description are required.');
      return;
    }

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
        submitted_at: new Date().toISOString(),
        status: 'Pending',
        upvotes: 0,
        ...response,
        image_url: imageUrl
      };

      // Optimistically update list
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

  const inputClass = "w-full rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 shadow-neu-light placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all";

  // Success screen
  if (submitted && apiResponse) {
    return (
      <div className="fixed inset-0 z-50 min-h-screen bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="max-w-lg w-full mx-auto p-8 bg-surface rounded-2xl shadow-xl overflow-y-auto max-h-[90vh] border border-white/60">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center shadow-inner">
              <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Complaint Submitted!</h2>
            <p className="text-gray-500">AI has analyzed your complaint.</p>
          </div>

          <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide font-bold">Status</span>
                <p className="font-semibold text-gray-900">{apiResponse.status || 'Pending'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide font-bold">Category</span>
                <p className="font-medium text-brand">{apiResponse.category || 'AI Analysis Pending'}</p>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide font-bold">Priority</span>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold mt-1
                     ${apiResponse.priority === 'High' ? 'bg-red-50 text-error' : 'bg-green-50 text-success'}`}>
                  {apiResponse.priority || 'Normal'}
                </span>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-wide font-bold">Assigned To</span>
                <p className="font-medium text-gray-900">{apiResponse.assigned_authority || 'Pending'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-400 uppercase tracking-wide font-bold">AI Summary</span>
              <p className="text-sm text-gray-700 mt-1 italic leading-relaxed">"{apiResponse.summary || 'No summary available.'}"</p>
            </div>
          </div>

          <Button
            onClick={() => {
              setSubmitted(false);
              setApiResponse(null);
              navigate('/home');
            }}
            className="w-full py-3 shadow-lg shadow-brand/20"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-24 md:pl-24 transition-all duration-300">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Posts</h1>

          <div className="flex bg-surface rounded-lg shadow-neu-light p-1">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'create'
                ? 'bg-brand text-white shadow-md'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              Create
            </button>
            <button
              onClick={() => setActiveTab('mine')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'mine'
                ? 'bg-brand text-white shadow-md'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              My Posts
            </button>
          </div>
        </div>

        {activeTab === 'create' && (
          <Card className="p-6 sm:p-8 shadow-neu-flat">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter grievance title"
                  className={inputClass}
                  required
                />
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your issue..."
                  rows={4}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Complaint Visibility</label>
                <div className="flex gap-4">
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.visibility === 'public' ? 'border-brand bg-brand/5 text-brand shadow-sm' : 'border-gray-200 bg-gray-50 hover:bg-white text-gray-600'}`}>
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={formData.visibility === 'public'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="font-medium">Public</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.visibility === 'private' ? 'border-brand bg-brand/5 text-brand shadow-sm' : 'border-gray-200 bg-gray-50 hover:bg-white text-gray-600'}`}>
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={formData.visibility === 'private'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <span className="font-medium">Private</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {formData.visibility === 'public'
                    ? "Visible to all students in the public feed."
                    : "Visible only to you and the assigned authority."}
                </p>
              </div>

              {formData.visibility === 'private' && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <input
                    type="checkbox"
                    name="skipEscalation"
                    id="skipEscalation"
                    checked={formData.skipEscalation}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-brand focus:ring-brand"
                  />
                  <label htmlFor="skipEscalation" className="text-sm text-gray-700 cursor-pointer select-none">
                    Skip local authority and escalate immediately (if urgent)
                  </label>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Evidence {formData.visibility === 'public' && <span className="text-error">*</span>}
                </label>

                {!imagePreview ? (
                  <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${formData.visibility === 'public' && !formData.image ? 'border-brand/40 bg-brand/5 hover:bg-brand/10' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className={`w-8 h-8 mb-2 ${formData.visibility === 'public' && !formData.image ? 'text-brand' : 'text-gray-400'}`} />
                      <p className="text-xs text-gray-500 font-medium">Click to upload image</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, image: null });
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 shadow-lg shadow-brand/20 mt-4"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Grievance'}
              </Button>
            </form>
          </Card>
        )}

        {/* --- My Posts --- */}
        {activeTab === 'mine' && (
          <div className="space-y-5">
            {(!Array.isArray(myPosts) || myPosts.length === 0) ? (
              <div className="text-center py-16 bg-surface rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg font-medium">No complaints submitted yet.</p>
                <Button variant="ghost" className="mt-2 text-brand" onClick={() => setActiveTab('create')}>Create your first one</Button>
              </div>
            ) : (
              myPosts.map((post) => (
                <ComplaintCard
                  key={post.id || post.complaint_id}
                  id={post.id || post.complaint_id}
                  title={post.title}
                  desc={post.description}
                  category={post.category}
                  img={post.image_url}
                  author={post.name || user?.name || "You"}
                  status={post.status}
                  priority={post.priority}
                  upvotes={post.upvotes}
                  timestamp={post.submitted_at || post.created_at}
                />
              ))
            )}
          </div>
        )}
      </div>

      {user?.role === 'student' && <BottomNav />}
    </div>
  );
}
