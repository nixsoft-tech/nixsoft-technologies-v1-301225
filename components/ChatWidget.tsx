import React, { useState, lazy, Suspense } from 'react';
import { MessageSquare, X } from 'lucide-react';

// The chat window (with its HTML sanitiser, AI client and lead form) is a
// separate chunk, loaded on the first click, so it isn't in the main bundle
// every page downloads. Once loaded it stays mounted, keeping the chat.
const ChatPanel = lazy(() => import('./ChatPanel'));

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const toggleChat = () => {
    setLoaded(true);
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isOpen ? 'bg-slate-800 rotate-90' : 'bg-nixGreen hover:bg-green-400'
        } text-white`}
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} color="#0f172a" fill="#0f172a" />}
      </button>

      {loaded && (
        <Suspense fallback={null}>
          <ChatPanel open={isOpen} />
        </Suspense>
      )}
    </>
  );
};

export default ChatWidget;
