import React from 'react';
import { Badge, EliteButton } from '../../../components/UI';
import { format } from 'date-fns';
import { MessageSquare, ThumbsUp, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthorityComplaintCard = ({ complaint, onStatusUpdate, onFlagSpam }) => {
    const navigate = useNavigate();

    const priorityColors = {
        Critical: 'red',
        High: 'orange',
        Medium: 'amber',
        Low: 'gray'
    };

    const statusColors = {
        Resolved: 'green',
        'In Progress': 'blue', // Prompt asked for Blue for In Progress
        Raised: 'yellow',      // Prompt asked for Yellow for Raised
        Closed: 'gray',
        Spam: 'red'
    };

    return (
        <div
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-4"
            onClick={() => navigate(`/complaint/${complaint.id}`)}
        >
            {/* Header: Status & Priority */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <Badge color={statusColors[complaint.status] || 'gray'}>{complaint.status}</Badge>
                    <Badge color={priorityColors[complaint.priority] || 'gray'}>{complaint.priority}</Badge>
                    <span className="text-xs text-gray-400 font-medium">#{complaint.id.toString().slice(-6)}</span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                    {format(new Date(complaint.submitted_at), 'MMM dd, h:mm a')}
                </span>
            </div>

            {/* Content */}
            <div className="mb-4">
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{complaint.category_name || 'General Complaint'}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {complaint.rephrased_text || complaint.original_text}
                        </p>
                    </div>
                    {complaint.has_image && (
                        <div className="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 ml-4 border border-gray-100">
                            <ImageIcon size={20} className="text-gray-400" />
                        </div>
                    )}
                </div>
            </div>

            {/* Footer: Meta & Actions */}
            <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                <div className="flex items-center gap-4 text-gray-400">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                        <ThumbsUp size={14} />
                        <span>{complaint.upvotes || 0}</span>
                    </div>
                    {/* Add more meta if needed, e.g. comments count */}
                </div>

                <div className="flex items-center gap-2">
                    {/* Actions based on mockup/prompt */}
                    {complaint.status === 'Raised' && (
                        <EliteButton
                            size="sm"
                            variant="warning"
                            onClick={(e) => {
                                e.stopPropagation();
                                onStatusUpdate(complaint.id, 'In Progress');
                            }}
                        >
                            Start Working
                        </EliteButton>
                    )}

                    {complaint.status === 'In Progress' && (
                        <EliteButton
                            size="sm"
                            variant="success"
                            onClick={(e) => {
                                e.stopPropagation();
                                onStatusUpdate(complaint.id, 'Resolved');
                            }}
                        >
                            Resolve
                        </EliteButton>
                    )}

                    {complaint.status !== 'Spam' && complaint.status !== 'Closed' && (
                        <EliteButton
                            size="sm"
                            variant="danger"
                            className="bg-red-50 text-red-600 border-red-100 hover:bg-red-100" // Override for lighter danger style if preferred for secondary action
                            onClick={(e) => onFlagSpam(e, complaint.id)}
                        >
                            Spam
                        </EliteButton>
                    )}

                    <EliteButton
                        size="sm"
                        variant="secondary" // Using our new secondary (outline style)
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/complaint/${complaint.id}`);
                        }}
                    >
                        View
                    </EliteButton>
                </div>
            </div>
        </div>
    );
};

export default AuthorityComplaintCard;
