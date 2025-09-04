import React from 'react';
import { Crown, Award, Clock, MessageSquare, Reply } from 'lucide-react';
import type { Message } from '../../types';

const getTimeAgo = (date: string) => {
  const now = new Date();
  const messageDate = new Date(date);
  const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60));
  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return messageDate.toLocaleDateString();
};

type Props = {
  message: Message,
  isReply?: boolean,
  user?: any,
  expandedReplies: Set<string>,
  toggleReplies: (id: string) => void,
  handleReply: (message: Message) => void,
};

const MessageItem: React.FC<Props> = ({
  message, isReply = false, user, expandedReplies, toggleReplies, handleReply,
}) => (
  <div className={`${isReply ? 'ml-8 mt-3' : ''} bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors`}>
    <div className="flex">
      <div className="flex-1 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex-shrink-0">
            {message.sender.profilePic ? (
              <img src={message.sender.profilePic} alt={message.sender.username}
                className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {message.sender.username.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 flex-wrap">
            <span className="font-semibold text-gray-900 hover:text-red-600 cursor-pointer">
              u/{message.sender.username}
            </span>
            {message.sender.role === 'SENIOR' && (
              <div className="flex items-center space-x-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full">
                <Crown className="h-3 w-3 text-white" />
                <span className="text-xs font-bold text-white">SENIOR</span>
              </div>
            )}
            {message.sender.role === 'ADMIN' && (
              <div className="flex items-center space-x-1 px-2 py-0.5 bg-gradient-to-r from-green-400 to-green-500 rounded-full">
                <Award className="h-3 w-3 text-white" />
                <span className="text-xs font-bold text-white">ADMIN</span>
              </div>
            )}
            <span className="text-xs text-gray-500 flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{getTimeAgo(message.createdAt)}</span>
            </span>
          </div>
        </div>

        {message.replyTo && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-red-400">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-red-600">u/{message.replyTo.sender.username}:</span>{' '}
              <span className="italic">
                {message.replyTo.message.length > 100 
                  ? `${message.replyTo.message.substring(0, 100)}...` 
                  : message.replyTo.message
                }
              </span>
            </p>
          </div>
        )}

        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {message.message}
          </p>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <button
            onClick={() => toggleReplies(message.id)}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{message._count?.replies || 0} replies</span>
          </button>
          {user?.role === 'SENIOR' && !isReply && (
            <button
              onClick={() => handleReply(message)}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-600 font-medium transition-colors"
            >
              <Reply className="h-4 w-4" />
              <span>Reply</span>
            </button>
          )}
        </div>
      </div>
    </div>

    {expandedReplies.has(message.id) && message.replies && message.replies.length > 0 && (
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="p-4 space-y-3">
          {message.replies.map((reply) => (
            <MessageItem
              key={reply.id}
              message={reply}
              isReply={true}
              user={user}
              expandedReplies={expandedReplies}
              toggleReplies={toggleReplies}
              handleReply={handleReply}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);

export default MessageItem;
