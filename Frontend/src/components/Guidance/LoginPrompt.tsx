import React from 'react';
import { MessageCircle } from 'lucide-react';

const LoginPrompt: React.FC = () => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
    <MessageCircle className="h-12 w-12 mx-auto text-yellow-500 mb-3" />
    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Join the Conversation</h3>
    <p className="text-yellow-700">
      Please log in to participate in discussions and get guidance from senior students.
    </p>
  </div>
);

export default LoginPrompt;
