import React, { useState } from 'react';
import { TopNav, BottomNav } from '../components/Navbars';
import { Card } from '../components/UI';

const CATEGORIES = ['Hostel', 'Mess', 'Academics', 'Infrastructure', 'Transport', 'Other'];

export default function SubmitComplaint() {
  const [form, setForm] = useState({ title: '', category: '', description: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setForm({ title: '', category: '', description: '' });
      setSubmitted(false);
    }, 2000);
  };

  const isFormValid = form.title && form.category && form.description;

  return (
    <div className="min-h-screen">
      <TopNav />
      <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-20">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Submit a Complaint</h1>
        
        {submitted ? (
          <Card className="p-8 text-center">
            <div className="text-green-600 mb-2">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Complaint Submitted!</h2>
            <p className="text-gray-600">Thank you for your feedback. We'll review it shortly.</p>
          </Card>
        ) : (
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Brief title for your complaint"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your complaint in detail..."
                  rows={6}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand"
                />
              </div>
              
              <button
                disabled={!isFormValid}
                className="w-full bg-brand disabled:opacity-60 hover:bg-brand-dark text-white rounded-lg px-4 py-3 font-medium transition-colors"
              >
                Submit Complaint
              </button>
            </form>
          </Card>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

