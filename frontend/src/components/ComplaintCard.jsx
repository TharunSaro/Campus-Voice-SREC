import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './UI';
import { useAuth } from '../context/AuthContext';
import complaintService from '../services/complaint.service';

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
    <Link to={`/complaint/${id}`} className="block">
      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden transition hover:shadow-md cursor-pointer">
        {img && (
          <img src={img} alt={title} className="w-full h-48 object-cover" />
        )}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <Badge type={status}>{status || 'Pending'}</Badge>
            <span className="text-xs text-gray-400">
              {timestamp ? new Date(timestamp).toLocaleDateString() : ''}
            </span>
          </div>

          <h3 className="font-semibold text-lg text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">{desc}</p>

          <div className="flex justify-between items-center text-xs mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">{category}</span>
              {priority && <span className={`px-2 py-1 rounded font-medium ${priority === 'High' ? 'text-red-600 bg-red-50' : 'text-gray-500'}`}>{priority}</span>}
            </div>

            <div className="flex items-center gap-3 text-gray-500">
              <button
                onClick={(e) => handleVote(e, 'upvote')}
                disabled={isVoting}
                className={`flex items-center gap-1 transition ${userVote === 'upvote' ? 'text-green-600 font-bold' : 'text-gray-500 hover:text-green-600'}`}
                title="Upvote"
              >
                👍 {voteCount.up}
              </button>
              <span>•</span>
              <button
                onClick={(e) => handleVote(e, 'downvote')}
                disabled={isVoting}
                className={`flex items-center gap-1 transition ${userVote === 'downvote' ? 'text-red-600 font-bold' : 'text-gray-500 hover:text-red-600'}`}
                title="Downvote"
              >
                👎 {voteCount.down}
              </button>
              <span>•</span>
              <span>{author}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
