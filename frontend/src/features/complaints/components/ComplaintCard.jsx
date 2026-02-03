import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../../../components/UI';
import { useAuth } from '../../../context/AuthContext';
import complaintService from '../../../services/complaint.service';
import { ThumbsUp, ThumbsDown, Sparkles } from 'lucide-react';

export default function ComplaintCard({
  id,
  title,
  desc,
  summary,
  category,
  img,
  author = "Anonymous Student",
  status,
  priority,
  upvotes,
  downvotes,
  timestamp,
  isOwner = false
}) {
  const { user } = useAuth();
  const [voteCount, setVoteCount] = useState({ up: upvotes || 0, down: downvotes || 0 });
  const [userVote, setUserVote] = useState(null); // 'upvote', 'downvote', or null
  const [isVoting, setIsVoting] = useState(false);

  // Fetch updated stats if not provided or to ensure freshness
  useEffect(() => {
    setVoteCount({ up: upvotes || 0, down: downvotes || 0 });
  }, [upvotes, downvotes]);

  const handleVote = async (e, type) => {
    e.preventDefault();
    if (!user?.reg_no) {
      alert("Please login to vote");
      return;
    }
    if (isVoting) return;

    setIsVoting(true);
    try {
      const response = await complaintService.voteComplaint(id, user.reg_no, type);
      console.log("Vote Response:", response);

      if (response.upvotes !== undefined && response.downvotes !== undefined) {
        setVoteCount({
          up: parseInt(response.upvotes),
          down: parseInt(response.downvotes)
        });
      }

      const action = response.action || response.message || '';

      // Properly handle vote state based on backend response
      if (action.includes('removed') || action === 'upvote_removed' || action === 'downvote_removed') {
        // Vote was removed - reset to neutral
        setUserVote(null);
      } else if (action === 'upvote_added' || (action === 'vote_changed' && type === 'upvote')) {
        setUserVote('upvote');
      } else if (action === 'downvote_added' || (action === 'vote_changed' && type === 'downvote')) {
        setUserVote('downvote');
      } else if (action === 'vote_changed') {
        setUserVote(type);
      } else {
        // Fallback: toggle logic based on current state
        if (userVote === type) {
          // Clicking same button again - toggle off
          setUserVote(null);
        } else {
          setUserVote(type);
        }
      }

    } catch (error) {
      console.error("Vote failed:", error);
      alert(error.message || "Failed to vote");
    } finally {
      setIsVoting(false);
    }
  };

  // Display logic based on ownership
  // Public view: Only show AI summary (or fallback to desc if no summary)
  // Owner view: Show both description and summary
  const displayContent = isOwner ? null : (summary || desc);

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
            {/* Badges on image */}
            <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
              <Badge type={status} variant="status">{status || 'Pending'}</Badge>
              {priority && (
                <Badge type={priority} variant="priority">{priority}</Badge>
              )}
            </div>
          </div>
        )}

        <div className="p-5">
          {/* Badges row when no image */}
          {!img && (
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge type={status} variant="status">{status || 'Pending'}</Badge>
                {priority && (
                  <Badge type={priority} variant="priority">{priority}</Badge>
                )}
              </div>
              <span className="text-xs text-gray-400">
                {timestamp ? new Date(timestamp).toLocaleDateString() : ''}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight group-hover:text-brand transition-colors">{title}</h3>

          {/* Content display based on ownership */}
          {isOwner ? (
            <>
              {/* Owner view: Show both description and AI summary */}
              {desc && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 font-medium mb-1">Your submitted description</div>
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{desc}</p>
                </div>
              )}
              {summary && (
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-brand font-medium mb-1">
                    <Sparkles size={12} className="text-brand" />
                    <span>Reviewed Summary</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{summary}</p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Public view: Only show AI summary */}
              {summary && (
                <div className="flex items-center gap-1.5 text-xs text-brand font-medium mb-1.5">
                  <Sparkles size={12} className="text-brand" />
                  <span>Reviewed Summary</span>
                </div>
              )}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{displayContent}</p>
            </>
          )}

          {/* Category Badge + Metadata */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {category && (
              <Badge type={category} variant="category">{category}</Badge>
            )}
            {img && timestamp && (
              <span className="text-xs text-gray-400 ml-auto">
                {new Date(timestamp).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Voting Section with helper text */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {/* Upvote Button */}
              <button
                onClick={(e) => handleVote(e, 'upvote')}
                disabled={isVoting}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                  transition-all duration-200
                  ${userVote === 'upvote'
                    ? 'bg-brand/10 text-brand shadow-inner border border-brand/20'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-brand/5 hover:border-brand/30 hover:text-brand hover:shadow-vote-glow'
                  }
                  active:scale-95
                `}
                title="Upvote"
              >
                <ThumbsUp size={16} className={userVote === 'upvote' ? 'fill-current' : ''} />
                <span>{voteCount.up}</span>
              </button>

              {/* Downvote Button */}
              <button
                onClick={(e) => handleVote(e, 'downvote')}
                disabled={isVoting}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                  transition-all duration-200
                  ${userVote === 'downvote'
                    ? 'bg-error/10 text-error shadow-inner border border-error/20'
                    : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-error/5 hover:border-error/30 hover:text-error hover:shadow-vote-glow-down'
                  }
                  active:scale-95
                `}
                title="Downvote"
              >
                <ThumbsDown size={16} className={userVote === 'downvote' ? 'fill-current' : ''} />
                <span>{voteCount.down}</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-3 font-medium">
              👆 Helps authorities prioritise this issue
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
