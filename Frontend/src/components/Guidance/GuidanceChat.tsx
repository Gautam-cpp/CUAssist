import React, { useState, useEffect } from 'react';
import { guidanceService } from '../../services/guidanceService';
import type { Message } from '../../types';
import { useAuth } from '../../context/useAuth';
import toast from 'react-hot-toast';

import MessageInput from './MessageInput';
import LoginPrompt from './LoginPrompt';
import MessageList from './MessageList';

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

  useEffect(() => { fetchMessages(); }, []);
  
  const fetchMessages = async (pageNum = 1) => {
    try {
      setLoading(pageNum === 1);
      const response = await guidanceService.getMessages(pageNum, 20);
      if (pageNum === 1) setMessages(response);
      else setMessages(prev => [...prev, ...response]);
      setHasMore(response.length === 20);
    } catch (error) {
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
      const messageData = { content: newMessage.trim(), replyToId: replyTo?.id };
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
    if (!user) { toast.error('Please log in to reply'); return; }
    if (user.role !== 'SENIOR') {
      toast.error('Only senior students can reply to messages'); return;
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
    setExpandedReplies(prev => {
      const newExpanded = new Set(prev);
      newExpanded.has(messageId)
        ? newExpanded.delete(messageId)
        : newExpanded.add(messageId);
      return newExpanded;
    });
  };

  const loadMore = () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMessages(nextPage);
  };

  if (loading && page === 1)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
     
      {user ? (
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSend={handleSendMessage}
          sending={sending}
          replyTo={replyTo ? {sender: replyTo.sender, message: replyTo.message} : undefined}
          onCancelReply={() => setReplyTo(null)}
          userRole={user.role}
        />
      ) : <LoginPrompt />}
      <MessageList
        messages={messages}
        loading={loading}
        hasMore={hasMore}
        loadMore={loadMore}
        expandedReplies={expandedReplies}
        toggleReplies={toggleReplies}
        user={user}
        handleReply={handleReply}
      />
    </div>
  );
};

export default GuidanceChat;
