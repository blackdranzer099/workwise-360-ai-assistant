import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import type { ChatMessage, UserProfile } from './types';
import { mockChatApi } from './services/api';

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const user: UserProfile = {
    name: 'Saikiran Pamula',
    role: 'Product Manager',
  };

  useEffect(() => {
    // Local memory: load last 10 prompts
    const saved = localStorage.getItem('workwise_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved).slice(-10));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  useEffect(() => {
    // Save to local storage on change
    if (messages.length > 0) {
      localStorage.setItem('workwise_chat_history', JSON.stringify(messages.slice(-10)));
    }
    
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [messages, toast]);

  const handleSendMessage = async (text: string) => {
    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);

    try {
      const response = await mockChatApi({ employeeId: 'GAC2025-FJ', question: text });
      
      const newBotMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.reply,
        timestamp: new Date().toISOString(),
        cards: response.cards,
      };

      setMessages((prev) => [...prev, newBotMsg]);
    } catch (error: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: error.message || 'Live services unavailable. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      setToast({ message: 'API Request Failed', type: 'error' });
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    localStorage.removeItem('workwise_chat_history');
    setToast({ message: 'Chat cleared', type: 'success' });
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-gray-100 flex items-center justify-center p-4 md:p-6 lg:p-8 font-sans selection:bg-cyan-500/30">
      <div 
        className="w-full max-w-7xl h-[100dvh] md:h-[85vh] min-h-[600px] flex flex-col md:flex-row bg-[#0E131F]/80 backdrop-blur-3xl rounded-3xl border border-white/10 shadow-2xl shadow-cyan-900/10 overflow-hidden relative"
      >
        <Sidebar 
          user={user} 
          onClearChat={handleClearChat}
          onQuickAction={handleSendMessage} 
        />
        
        <ChatWindow 
          messages={messages}
          isTyping={isTyping}
          onSendMessage={handleSendMessage}
        />
        
        {/* Toast Notification */}
        {toast && (
          <div className={`absolute top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full glass-panel flex items-center gap-2 shadow-2xl animate-fade-in-down`}>
            <div className={`w-2 h-2 rounded-full ${toast.type === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        )}
      </div>

      {/* Decorative gradient glowing orb */}
      <div className="pointer-events-none fixed top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] -z-10 mix-blend-screen"></div>
      <div className="pointer-events-none fixed bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[128px] -z-10 mix-blend-screen"></div>
    </div>
  );
}

export default App;
