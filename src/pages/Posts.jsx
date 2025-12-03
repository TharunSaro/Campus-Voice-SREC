import React, { useState } from 'react';
import { TopNav } from '../components/Navbars';
import BottomNav from '../components/BottomNav';
import { Card } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function Posts() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    image: null,
  });
  const [myPosts, setMyPosts] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert('Please upload an image before submitting.');
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
      category: 'General',
      image: null,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />

      {/* Page Content */}
      <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Posts</h1>

          {/* Tabs */}
          <div className="flex bg-white rounded-full shadow-sm overflow-hidden border border-gray-200">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === 'create'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setActiveTab('mine')}
              className={`px-4 py-2 text-sm font-medium transition ${
                activeTab === 'mine'
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option>General</option>
                  <option>Hostel</option>
                  <option>Mess</option>
                  <option>Transport</option>
                  <option>Academics</option>
                  <option>Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image (required)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                  required
                  className="w-full border rounded-lg px-3 py-2 bg-gray-50"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Submit Grievance
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
                  <p className="mt-1 text-sm text-blue-600 font-medium">
                    #{post.category}
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
