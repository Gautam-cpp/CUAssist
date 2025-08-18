import React, { useState, useEffect } from 'react';
import { guidanceService } from '../../services/guidanceService';
import type { Message } from '../../types';
import { useAuth } from '../../context/useAuth';
import { Send, MessageCircle, User, Reply, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

const GuidanceChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await guidanceService.getMessages();
      setMessages(response);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      await guidanceService.sendMessage({
        content: newMessage,
        replyToId: replyTo?.id,
      });
      setNewMessage('');
      setReplyTo(null);
      await fetchMessages();
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleReply = (message: Message) => {
    if (user?.role !== 'SENIOR') {
      toast.error('Only senior students can reply to messages');
      return;
    }
    setReplyTo(message);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <MessageCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Guidance Forum</h1>
            <p className="text-gray-600">Ask questions and get help from senior students</p>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-red-50 rounded-xl p-4">
          <h3 className="font-semibold text-red-900 mb-2">Forum Guidelines</h3>
          <ul className="text-sm text-red-800 space-y-1">
            <li>• Be respectful and constructive in your communication</li>
            <li>• Ask clear, specific questions to get better help</li>
            <li>• Senior students can reply to provide guidance</li>
            <li>• All messages are moderated for safety</li>
          </ul>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {replyTo && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Replying to {replyTo.sender.username}:
              </span>
              <button
                onClick={() => setReplyTo(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{replyTo.message}</p>
          </div>
        )}

        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={replyTo ? 'Write your reply...' : 'Ask a question or share guidance...'}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !newMessage.trim()}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {message.sender.profilePic ? (
                  <img
                    src={message.sender.profilePic}
                    alt={message.sender.username}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-gray-900">{message.sender.username}</span>
                  {user?.role === 'SENIOR' && (
                    <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 rounded-full">
                      <Crown className="h-3 w-3 text-yellow-600" />
                      <span className="text-xs font-medium text-yellow-700">Senior</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-500">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>

                {message.replyTo && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{message.replyTo.sender.username}:</span>{' '}
                      {message.replyTo.message}
                    </p>
                  </div>
                )}

                <p className="text-gray-800 mb-3">{message.message}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {message._count.replies > 0 && (
                      <span>{message._count.replies} replies</span>
                    )}
                  </div>
                  {user?.role === 'SENIOR' && (
                    <button
                      onClick={() => handleReply(message)}
                      className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      <Reply className="h-4 w-4" />
                      <span>Reply</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 mb-4">No messages yet</p>
            <p className="text-sm text-gray-500">
              Start the conversation by asking a question!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuidanceChat;