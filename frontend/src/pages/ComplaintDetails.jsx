import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopNav } from '../components/Navbars';
import { Card, Badge, Skeleton } from '../components/UI';
import complaintService from '../services/complaint.service';

export default function ComplaintDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const data = await complaintService.getComplaintDetails(id);
                setComplaint(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <TopNav />
                <div className="max-w-3xl mx-auto p-6 pt-10">
                    <Skeleton className="h-64 rounded-xl mb-6" />
                    <Skeleton className="h-10 w-1/3 mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        );
    }

    if (error || !complaint) {
        return (
            <div className="min-h-screen bg-gray-50">
                <TopNav />
                <div className="max-w-3xl mx-auto p-6 pt-20 text-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Complaint Not Found</h2>
                    <p className="text-gray-500 mb-6">{error || "The complaint you're looking for doesn't exist or you don't have permission to view it."}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <TopNav />

            <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-20">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition"
                >
                    ← Back
                </button>

                <Card className="overflow-hidden">
                    {complaint.image_url && (
                        <img
                            src={complaint.image_url}
                            alt={complaint.title}
                            className="w-full h-64 sm:h-80 object-cover"
                            onError={(e) => { e.target.style.display = 'none' }}
                        />
                    )}

                    <div className="p-6 sm:p-8">
                        {/* Header: Status and Metadata */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <div className="flex gap-2">
                                <Badge type={complaint.status}>{complaint.status || 'Pending'}</Badge>
                                {complaint.priority && (
                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold flex items-center
                    ${complaint.priority === 'Critical' || complaint.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {complaint.priority} Priority
                                    </span>
                                )}
                            </div>
                            <span className="text-sm text-gray-500">
                                Submitted on {new Date(complaint.submitted_at || complaint.created_at).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Title & Category */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{complaint.title}</h1>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                {complaint.category || 'General'}
                            </span>
                            <span className="text-sm text-gray-500">• Visibility: <span className="capitalize">{complaint.visibility}</span></span>
                        </div>

                        {/* Content */}
                        <div className="prose max-w-none text-gray-700 mb-8 leading-relaxed whitespace-pre-wrap">
                            {complaint.description}
                        </div>

                        {/* Voting & Interaction */}
                        <div className="flex items-center gap-6 py-4 border-t border-b border-gray-100 mb-8">
                            <div className="flex items-center gap-2">
                                <span className="text-xl">👍</span>
                                <span className="font-semibold text-gray-700">{complaint.upvotes || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xl">👎</span>
                                <span className="font-semibold text-gray-700">{complaint.downvotes || 0}</span>
                            </div>
                            <div className="text-sm text-gray-500 ml-auto">
                                Net Votes: <span className="font-medium text-gray-900">{complaint.net_votes || 0}</span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                            {/* Student Info - Only if available/applicable */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Reported By</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-900">{complaint.student?.name || "Anonymous"}</span></p>
                                    {complaint.student?.department && <p><span className="text-gray-500">Dept:</span> <span className="text-gray-900">{complaint.student.department}</span></p>}
                                    {complaint.student?.stay_type && <p><span className="text-gray-500">Stay:</span> <span className="text-gray-900 capitalize">{complaint.student.stay_type}</span></p>}
                                </div>
                            </div>

                            {/* Authority Info */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Assigned Authority</h3>
                                <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-500">Assigned To:</span> <span className="font-medium text-gray-900">{complaint.assigned_authority || "Pending Assignment"}</span></p>
                                    {complaint.authority_email && <p><span className="text-gray-500">Email:</span> <span className="text-blue-600">{complaint.authority_email}</span></p>}
                                </div>
                            </div>
                        </div>

                        {/* LLM Analysis */}
                        {complaint.llm_analysis && (
                            <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                                <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                    ✨ AI Analysis
                                </h3>
                                <div className="text-sm text-indigo-800">
                                    <p className="mb-1"><span className="font-semibold">Summary:</span> {complaint.llm_analysis.summary}</p>
                                    <p><span className="font-semibold">Suggested Action:</span> {complaint.llm_analysis.suggested_action}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </Card>
            </div>
        </div>
    );
}
