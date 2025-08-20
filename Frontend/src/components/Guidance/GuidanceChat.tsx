import React, { useState, useEffect } from 'react';
import { guidanceService } from '../../services/guidanceService';
import type { Message } from '../../types';
import { useAuth } from '../../context/useAuth';
import { 
  Send, 
  MessageCircle, 
  Reply, 
  Crown, 
  MessageSquare,
  Clock,
  Award
} from 'lucide-react';
import toast from 'react-hot-toast';

const GuidanceChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async (pageNum = 1) => {
    try {
      setLoading(pageNum === 1);
      const response = await guidanceService.getMessages(pageNum, 20);
      if (pageNum === 1) {
        setMessages(response);
      } else {
        setMessages(prev => [...prev, ...response]);
      }
      setHasMore(response.length === 20);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    if (!user) {
      toast.error('Please log in to send messages');
      return;
    }

    setSending(true);
    try {
      const messageData = {
        content: newMessage.trim(),
        replyToId: replyTo?.id,
      };

      await guidanceService.sendMessage(messageData);
      setNewMessage('');
      setReplyTo(null);
      await fetchMessages(1);
      setPage(1);
      toast.success(replyTo ? 'Reply sent successfully!' : 'Message sent successfully!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send message';
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const handleReply = (message: Message) => {
    if (!user) {
      toast.error('Please log in to reply');
      return;
    }
    if (user.role !== 'SENIOR') {
      toast.error('Only senior students can reply to messages');
      return;
    }
    setReplyTo(message);
    setTimeout(() => {
      const input = document.querySelector('.message-input textarea') as HTMLTextAreaElement;
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const toggleReplies = (messageId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedReplies(newExpanded);
  };

  const loadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMessages(nextPage);
  };

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

  const MessageComponent = ({ message, isReply = false }: { message: Message, isReply?: boolean }) => (
    <div className={`${isReply ? 'ml-8 mt-3' : ''} bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors`}>
      {/* Vote buttons for main messages */}
      <div className="flex">
        
        
        <div className="flex-1 p-4">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex-shrink-0">
              {message.sender.profilePic ? (
                <img
                  src={message.sender.profilePic}
                  alt={message.sender.username}
                  className="h-8 w-8 rounded-full object-cover"
                />
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

          {/* Reply context */}
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

          {/* Message content */}
          <div className="mb-4">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {message.message}
            </p>
          </div>

          {/* Actions */}
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

      {/* Nested replies */}
      {expandedReplies.has(message.id) && message.replies && message.replies.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="p-4 space-y-3">
            {message.replies.map((reply) => (
              <MessageComponent key={reply.id} message={reply} isReply={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">r/StudentGuidance</h1>
            <p className="text-gray-600">Ask questions • Share knowledge • Help each other</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center space-x-6 text-sm text-gray-600 border-t pt-4">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <span>Active Community</span>
          </div>
          <span>•</span>
          <span>{messages.length} discussions</span>
          <span>•</span>
          <span>Moderated for safety</span>
        </div>
      </div>

      {/* Message Input */}
      {user && (
        <div className="message-input bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4 z-10">
          {replyTo && (
            <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-700">
                  Replying to u/{replyTo.sender.username}
                </span>
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-red-400 hover:text-red-600 font-bold text-lg"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-red-600 bg-white rounded p-2 border-l-4 border-red-300">
                "{replyTo.message.length > 100 ? replyTo.message.substring(0, 100) + '...' : replyTo.message}"
              </p>
            </div>
          )}

          <div className="space-y-4">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={replyTo ? 'Write your reply...' : 'What would you like to discuss? Ask questions, share knowledge, or provide guidance...'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              rows={3}
              disabled={sending}
            />
            
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500 space-x-4">
                <span>• Be respectful and constructive</span>
                <span>• Use Shift+Enter for line breaks</span>
                {user.role !== 'SENIOR' && <span>• Only seniors can reply to messages</span>}
              </div>
              <button
                onClick={handleSendMessage}
                disabled={sending || !newMessage.trim()}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
              >
                {sending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>{replyTo ? 'Reply' : 'Post'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Login prompt for non-logged in users */}
      {!user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <MessageCircle className="h-12 w-12 mx-auto text-yellow-500 mb-3" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Join the Conversation</h3>
          <p className="text-yellow-700">Please log in to participate in discussions and get guidance from senior students.</p>
        </div>
      )}

      {/* Messages */}
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageComponent key={message.id} message={message} />
        ))}

        {messages.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <MessageCircle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Start the conversation</h3>
            <p className="text-gray-500 mb-6">Be the first to ask a question or share guidance</p>
          </div>
        )}

        
        {hasMore && messages.length > 0 && (
          <div className="text-center py-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More Discussions'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidanceChat;
