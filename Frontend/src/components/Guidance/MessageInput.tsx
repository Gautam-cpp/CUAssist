import React from 'react';
import { Send } from 'lucide-react';

type Props = {
  value: string,
  onChange: (val: string) => void,
  onSend: () => void,
  sending: boolean,
  replyTo?: { sender: { username: string }, message: string },
  onCancelReply?: () => void,
  userRole?: string
};

const MessageInput: React.FC<Props> = ({
  value,
  onChange,
  onSend,
  sending,
  replyTo,
  onCancelReply,
  userRole,
}) => (
  <div className="message-input bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-4 z-10">
    {replyTo && (
      <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-red-700">
            Replying to u/{replyTo.sender.username}
          </span>
          <button
            onClick={onCancelReply}
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        placeholder={replyTo ? 'Write your reply...' : 'What would you like to discuss?'}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
        rows={3}
        disabled={sending}
      />

      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500 space-x-4">
          <span>• Be respectful and constructive</span>
          <span>• Use Shift+Enter for line breaks</span>
          {userRole !== 'SENIOR' && <span>• Only seniors can reply to messages</span>}
        </div>
        <button
          onClick={onSend}
          disabled={sending || !value.trim()}
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
);

export default MessageInput;
