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
        <div className="min-h-screen bg-background">
            <TopNav />

            <div className="max-w-3xl mx-auto p-4 sm:p-6 pb-24 md:pl-24 transition-all duration-300">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-brand transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Feed
                </button>

                <Card className="overflow-hidden shadow-neu-flat">
                    {complaint.image_url && (
                        <div className="relative">
                            <img
                                src={complaint.image_url}
                                alt={complaint.title}
                                className="w-full h-64 sm:h-96 object-cover"
                                onError={(e) => { e.target.style.display = 'none' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                        </div>
                    )}

                    <div className="p-6 sm:p-10">
                        {/* Header: Status and Metadata */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                            <div className="flex gap-3">
                                <Badge type={complaint.status}>{complaint.status || 'Pending'}</Badge>
                                {complaint.priority && (
                                    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold flex items-center border
                                    ${complaint.priority === 'Critical' || complaint.priority === 'High' ? 'bg-red-50 text-error border-red-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                        {complaint.priority} Priority
                                    </span>
                                )}
                            </div>
                            <span className="text-xs font-medium text-gray-400">
                                {new Date(complaint.submitted_at || complaint.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>

                        {/* Title & Category */}
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">{complaint.title}</h1>
                        <div className="flex items-center gap-2 mb-8 text-sm">
                            <span className="font-medium text-brand bg-brand/10 px-3 py-1 rounded-full">
                                {complaint.category || 'General'}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">Visibility: <span className="font-semibold text-gray-700 capitalize">{complaint.visibility}</span></span>
                        </div>

                        {/* Content */}
                        <div className="prose prose-blue max-w-none text-gray-600 mb-10 leading-relaxed whitespace-pre-wrap">
                            {complaint.description}
                        </div>

                        {/* Voting & Interaction */}
                        <div className="flex items-center gap-8 py-6 border-t border-b border-gray-100 mb-8 bg-gray-50/30 -mx-6 sm:-mx-10 px-6 sm:px-10">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl drop-shadow-sm">👍</span>
                                <span className="font-bold text-gray-700">{complaint.upvotes || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl drop-shadow-sm">👎</span>
                                <span className="font-bold text-gray-700">{complaint.downvotes || 0}</span>
                            </div>
                            <div className="text-sm text-gray-500 ml-auto font-medium">
                                Net Score: <span className={`font-bold ${complaint.net_votes > 0 ? 'text-success' : 'text-gray-900'}`}>{complaint.net_votes || 0}</span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-xl border border-gray-100 bg-gray-50/50">
                            {/* Student Info - Only if available/applicable */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Reported By</h3>
                                <div className="space-y-1.5 text-sm">
                                    <p className="flex justify-between"><span className="text-gray-500">Name:</span> <span className="font-semibold text-gray-900">{complaint.student?.name || "Anonymous"}</span></p>
                                    {complaint.student?.department && <p className="flex justify-between"><span className="text-gray-500">Dept:</span> <span className="text-gray-700">{complaint.student.department}</span></p>}
                                    {complaint.student?.stay_type && <p className="flex justify-between"><span className="text-gray-500">Stay:</span> <span className="text-gray-700 capitalize">{complaint.student.stay_type}</span></p>}
                                </div>
                            </div>

                            {/* Authority Info */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Assigned Authority</h3>
                                <div className="space-y-1.5 text-sm">
                                    <p className="flex justify-between"><span className="text-gray-500">Assigned To:</span> <span className="font-semibold text-gray-900">{complaint.assigned_authority || "Pending Assignment"}</span></p>
                                    {complaint.authority_email && <p className="flex justify-between overflow-hidden"><span className="text-gray-500">Email:</span> <span className="text-brand truncate ml-2">{complaint.authority_email}</span></p>}
                                </div>
                            </div>
                        </div>

                        {/* LLM Analysis */}
                        {complaint.llm_analysis && (
                            <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 shadow-sm">
                                <h3 className="text-sm font-bold text-brand-dark mb-4 flex items-center gap-2">
                                    ✨ AI Analysis
                                </h3>
                                <div className="text-sm text-gray-700 space-y-3">
                                    <p><span className="font-semibold text-indigo-900">Summary:</span> {complaint.llm_analysis.summary}</p>
                                    <p><span className="font-semibold text-indigo-900">Suggested Action:</span> {complaint.llm_analysis.suggested_action}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </Card>
            </div>
        </div>
    );
}
