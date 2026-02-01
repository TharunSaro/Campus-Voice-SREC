import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './UI';
import { useAuth } from '../context/AuthContext';
import complaintService from '../services/complaint.service';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';

export default function ComplaintCard({
  id,
  title,
  desc,
  category,
  img,
  author = "Anonymous Student",
  status,
  priority,
  upvotes,
  downvotes,
  timestamp
}) {
  const { user } = useAuth();
  const [voteCount, setVoteCount] = useState({ up: upvotes || 0, down: downvotes || 0 });
  const [userVote, setUserVote] = useState(null); // 'upvote', 'downvote', or null
  const [isVoting, setIsVoting] = useState(false);

  // Fetch updated stats if not provided or to ensure freshness
  useEffect(() => {
    // If props change, update state, but handleVote logic handles local optimistic updates
    setVoteCount({ up: upvotes || 0, down: downvotes || 0 });
  }, [upvotes, downvotes]);


  const handleVote = async (e, type) => {
    e.preventDefault(); // Prevent navigation
    if (!user?.reg_no) {
      alert("Please login to vote");
      return;
    }
    if (isVoting) return;

    setIsVoting(true);
    try {
      const response = await complaintService.voteComplaint(id, user.reg_no, type);
      console.log("Vote Response:", response);

      // Trust backend values if available, otherwise fallback to manual update (not needed if backend is consistent)
      if (response.upvotes !== undefined && response.downvotes !== undefined) {
        setVoteCount({
          up: parseInt(response.upvotes),
          down: parseInt(response.downvotes)
        });
      }

      // Update active state based on action or response
      const action = response.action || response.message;

      // Determine new user vote state
      switch (action) {
        case 'upvote_added':
        case 'vote_changed' && type === 'upvote': // Simplification: if we clicked upvote and it changed, we can assume it's now upvote
          setUserVote('upvote');
          break;
        case 'downvote_added':
          setUserVote('downvote');
          break;
        case 'upvote_removed':
        case 'downvote_removed':
          setUserVote(null);
          break;
        case 'vote_changed':
          setUserVote(type); // If type was the click action, and vote changed, likely to that type
          break;
        default:
          // If backend returns 'user_vote' field in future, usage would be better
          // For now, rely on action inference or just set to type if it wasn't a removal
          if (!action.includes('removed')) {
            setUserVote(type);
          } else {
            setUserVote(null);
          }
      }

    } catch (error) {
      console.error("Vote failed:", error);
      alert(error.message || "Failed to vote");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Link to={`/complaint/${id}`} className="block group">
      <div className="bg-surface rounded-xl shadow-neu-flat border border-white/60 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        {img && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <Badge type={status}>{status || 'Pending'}</Badge>
            </div>
          </div>
        )}

        <div className="p-5">
          {!img && (
            <div className="flex justify-between items-start mb-3">
              <Badge type={status}>{status || 'Pending'}</Badge>
              <span className="text-xs font-medium text-gray-400">
                {timestamp ? new Date(timestamp).toLocaleDateString() : ''}
              </span>
            </div>
          )}

          <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight group-hover:text-brand transition-colors">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{desc}</p>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-gray-50 text-gray-600 font-medium border border-gray-100">{category}</span>
              {priority && priority !== 'Low' && (
                <span className={`px-2 py-1 rounded-md font-medium border ${priority === 'High' ? 'text-error bg-red-50 border-red-100' : 'text-amber-600 bg-amber-50 border-amber-100'}`}>
                  {priority}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
              <button
                onClick={(e) => handleVote(e, 'upvote')}
                disabled={isVoting}
                className={`flex items-center gap-1.5 transition-colors ${userVote === 'upvote' ? 'text-success' : 'hover:text-success'}`}
                title="Upvote"
              >
                <ThumbsUp size={16} className={userVote === 'upvote' ? 'fill-current' : ''} />
                <span>{voteCount.up}</span>
              </button>

              <button
                onClick={(e) => handleVote(e, 'downvote')}
                disabled={isVoting}
                className={`flex items-center gap-1.5 transition-colors ${userVote === 'downvote' ? 'text-error' : 'hover:text-error'}`}
                title="Downvote"
              >
                <ThumbsDown size={16} className={userVote === 'downvote' ? 'fill-current' : ''} />
                <span>{voteCount.down}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
