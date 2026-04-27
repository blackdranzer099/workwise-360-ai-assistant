import React, { useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { MessageBubble } from './MessageBubble';
import { Send, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatWindowProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
}

export function ChatWindow({ messages, isTyping, onSendMessage }: ChatWindowProps) {
  const [input, setInput] = React.useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const suggestions = [
    "Give me my workday summary",
    "Do I have notifications today?",
    "What is my attendance?",
    "Any pending support requests?",
    "Show my projects"
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-background/50 relative overflow-hidden rounded-r-2xl">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-background/80 backdrop-blur-xl z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-background animate-pulse-slow"></div>
            <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Live Services Connected</h2>
            <p className="text-xs text-emerald-400">Online & Ready</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 font-medium">
          {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-lg mx-auto text-center space-y-8 fade-in">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-20 h-20 bg-accent-gradient rounded-3xl rotate-12 flex items-center justify-center shadow-2xl shadow-blue-500/20"
            >
              <span className="text-4xl text-white font-bold -rotate-12">W</span>
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-3">
                Ask me anything about your WorkWise day
              </h2>
              <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                I am connected to SnapLogic's enterprise APIs and can fetch your real-time workplace data instantly.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {suggestions.map((suggestion, i) => (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  key={suggestion}
                  onClick={() => onSendMessage(suggestion)}
                  className="px-4 py-2 rounded-full text-xs font-medium text-cyan-300 bg-cyan-400/10 border border-cyan-400/20 hover:bg-cyan-400/20 transition-colors"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full pb-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isTyping && <MessageBubble isTyping={true} />}
            <div ref={endOfMessagesRef} />
          </div>
        )}
      </div>

      {/* Input Composer Area */}
      <div className="p-4 bg-background/80 backdrop-blur-xl border-t border-white/5 pb-6">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-card border border-white/10 rounded-2xl p-2 shadow-lg focus-within:border-cyan-500/50 focus-within:shadow-cyan-500/10 transition-all">
            <div className="p-2 text-gray-500 cursor-not-allowed hidden md:block">
              <Mic size={20} />
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask WorkWise AI..."
              disabled={isTyping}
              className="flex-1 bg-transparent text-white placeholder-gray-500 resize-none py-2.5 px-2 max-h-32 focus:outline-none scrollbar-hide shrink"
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 bg-accent-gradient text-white rounded-xl disabled:opacity-50 disabled:grayscale transition-all shadow-md hover:shadow-cyan-500/20"
            >
              <Send size={18} />
            </button>
          </form>
          <div className="absolute -bottom-5 w-full text-center">
            <span className="text-[10px] text-gray-600 font-medium">WorkWise 360 AI Assistant — Powered by SnapLogic Live Services</span>
          </div>
        </div>
      </div>
    </div>
  );
}
