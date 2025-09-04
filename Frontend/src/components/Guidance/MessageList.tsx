import React from 'react';
import { MessageCircle } from 'lucide-react';
import MessageItem from './MessageItem';
import type { Message } from '../../types';

type Props = {
  messages: Message[],
  loading: boolean,
  hasMore: boolean,
  loadMore: () => void,
  expandedReplies: Set<string>,
  toggleReplies: (id: string) => void,
  user?: any,
  handleReply: (m: Message) => void,
};

const MessageList: React.FC<Props> = ({
  messages, loading, hasMore, loadMore, expandedReplies, toggleReplies, user, handleReply,
}) => (
  <div className="space-y-4">
    {messages.map((msg) => (
      <MessageItem
        key={msg.id}
        message={msg}
        user={user}
        expandedReplies={expandedReplies}
        toggleReplies={toggleReplies}
        handleReply={handleReply}
      />
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
);

export default MessageList;
