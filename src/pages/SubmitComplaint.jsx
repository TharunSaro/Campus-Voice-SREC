import React, { useState } from 'react';
import { TopNav, BottomNav } from '../components/Navbars';
import { Card } from '../components/UI';

const CATEGORIES = ['Hostel', 'Mess', 'Academics', 'Infrastructure', 'Transport', 'Other'];

export default function SubmitComplaint() {
  const [form, setForm] = useState({ title: '', category: '', description: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate successful submission
    setTimeout(() => {
      setForm({ title: '', category: '', description: '', image: null });
      setImagePreview(null);
      setSubmitted(false);
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    }, 3000);
  };

  const isFormValid = form.title && form.description && form.image;

  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="max-w-2xl mx-auto p-4 sm:p-6 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Submit a Complaint</h1>
          <p className="text-gray-600 text-sm">Please provide all required information</p>
        </div>
        
        {submitted ? (
          <Card className="p-10 text-center">
            <div className="text-green-600 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              Complaint has been submitted successfully, will be verified and posted soon
            </p>
          </Card>
        ) : (
          <Card className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Brief title for your complaint"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your complaint in detail..."
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-brand file:text-white hover:file:bg-brand-dark file:cursor-pointer"
                    required
                  />
                  {imagePreview && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 mb-2">Image Preview:</p>
                      <div className="relative rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className="w-full bg-brand disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-dark text-white rounded-lg px-6 py-3 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </Card>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

