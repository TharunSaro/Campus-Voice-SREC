// src/components/ComplaintCard.jsx
export default function ComplaintCard({ title, desc, category, img, author = "Anonymous Student" }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={img} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-700 text-sm mb-2">{desc}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded">{category}</span>
          <span>{author}</span>
        </div>
      </div>
    </div>
  );
}
