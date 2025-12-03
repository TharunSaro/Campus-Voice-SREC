// src/components/NewComplaintModal.jsx
import { useState } from "react";

export default function NewComplaintModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState({ title: "", desc: "", category: "", img: null });
  const [preview, setPreview] = useState("");

  if (!isOpen) return null;

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, img: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.desc || !form.category || !form.img) {
      alert("All fields including image are required!");
      return;
    }
    onAdd({
      ...form,
      img: preview,
      author: "You",
      id: Date.now(),
    });
    setForm({ title: "", desc: "", category: "", img: null });
    setPreview("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2">
        <h2 className="text-xl font-semibold mb-4">New Complaint</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input className="w-full border p-2 rounded" placeholder="Title"
            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <textarea className="w-full border p-2 rounded" placeholder="Description"
            value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })}></textarea>
          <select className="w-full border p-2 rounded"
            value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="">Select Category</option>
            <option value="Hostel">Hostel</option>
            <option value="Mess">Mess</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Academic">Academic</option>
          </select>
          <input type="file" accept="image/*" onChange={handleImage} className="w-full border p-2 rounded" />
          {preview && <img src={preview} alt="preview" className="mt-2 h-40 w-full object-cover rounded" />}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Post</button>
          </div>
        </form>
      </div>
    </div>
  );
}
