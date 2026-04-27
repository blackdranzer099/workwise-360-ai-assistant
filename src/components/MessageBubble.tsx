import type { ChatMessage, KpiCards } from '../types';
import { motion } from 'framer-motion';
import { Bot, Bell, CalendarCheck, LifeBuoy, Clock, Briefcase, Info } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for safe Tailwind class merging
export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface MessageBubbleProps {
  message?: ChatMessage;
  isTyping?: boolean;
}

function KpiWidget({ data }: { data: KpiCards }) {
  const cards = [];

  if (typeof data.notifications === 'number') {
    cards.push({ icon: Bell, label: 'Notifications', value: data.notifications, color: 'text-amber-400', bg: 'bg-amber-400/10' });
  }
  if (data.attendance) {
    cards.push({ icon: CalendarCheck, label: 'Attendance', value: data.attendance, color: 'text-emerald-400', bg: 'bg-emerald-400/10' });
  }
  if (typeof data.support === 'number') {
    cards.push({ icon: LifeBuoy, label: 'Support Reqs', value: data.support, color: 'text-rose-400', bg: 'bg-rose-400/10' });
  }
  if (data.timesheet) {
    cards.push({ icon: Clock, label: 'Timesheet', value: data.timesheet, color: 'text-blue-400', bg: 'bg-blue-400/10' });
  }
  if (typeof data.projects === 'number') {
    cards.push({ icon: Briefcase, label: 'Projects', value: data.projects, color: 'text-violet-400', bg: 'bg-violet-400/10' });
  }

  // Handle dynamic/extra cards sent by the API
  const standardKeys = ['notifications', 'attendance', 'support', 'timesheet', 'projects'];
  Object.keys(data).forEach(key => {
    if (!standardKeys.includes(key)) {
      // capitalize key (e.g. "workingHours" -> "Working Hours")
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      cards.push({
        icon: Info,
        label,
        value: data[key],
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10'
      });
    }
  });

  if (cards.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {cards.map((card, idx) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * idx }}
          key={card.label}
          className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-black/20"
        >
          <div className={cn("p-2 rounded-lg", card.bg, card.color)}>
            <card.icon size={18} />
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-0.5">{card.label}</p>
            <p className="text-sm font-semibold text-white">{card.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export function MessageBubble({ message, isTyping }: MessageBubbleProps) {
  if (isTyping) {
    return (
      <div className="flex w-full justify-start mb-6 drop-shadow-md">
        <div className="flex gap-3 max-w-[80%]">
          <div className="w-8 h-8 rounded-full bg-accent-gradient flex-shrink-0 flex items-center justify-center text-white shadow-lg">
            <Bot size={18} />
          </div>
          <div className="bg-card border border-white/5 p-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-12">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
              className="w-2 h-2 rounded-full bg-cyan-400/60"
            />
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
              className="w-2 h-2 rounded-full bg-cyan-400/60"
            />
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
              className="w-2 h-2 rounded-full bg-cyan-400/60"
            />
          </div>
        </div>
      </div>
    );
  }

  if (!message) return null;

  const isUser = message.sender === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full mb-6 drop-shadow-md",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn("flex gap-3 max-w-[85%]", isUser ? "flex-row-reverse" : "flex-row")}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-accent-gradient flex-shrink-0 flex items-center justify-center text-white shadow-lg mt-1">
            <Bot size={18} />
          </div>
        )}
        
        <div>
          <div
            className={cn(
              "px-5 py-3.5 text-[15px] leading-relaxed shadow-sm",
              isUser
                ? "bg-accent-gradient text-white rounded-2xl rounded-tr-sm"
                : "bg-card border border-white/5 text-gray-100 rounded-2xl rounded-tl-sm"
            )}
          >
            {message.text}
          </div>
          
          {!isUser && message.cards && (
            <KpiWidget data={message.cards} />
          )}

          <div className={cn("text-[11px] text-gray-500 mt-1.5", isUser ? "text-right mr-1" : "ml-1")}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
