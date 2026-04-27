import type { UserProfile } from '../types';
import { Bot, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { QuickActions } from './QuickActions';

interface SidebarProps {
  user: UserProfile;
  onClearChat: () => void;
  onQuickAction: (action: string) => void;
}

export function Sidebar({ user, onClearChat, onQuickAction }: SidebarProps) {
  return (
    <aside className="w-full md:w-72 lg:w-80 h-full flex flex-col p-4 glass-panel border-l-0 border-t-0 border-b-0 rounded-l-2xl">

      {/* ── Sriven Solutions Logo ─────────────────── */}
      <div className="flex flex-col gap-4 p-2 mb-6">
        <div className="flex items-center justify-center">
          <img
            src="/sriven-logo.png"
            alt="Sriven Solutions"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 w-full" />

        {/* WorkWise AI product name */}
        <div className="flex items-center gap-3">
          <div className="flex bg-accent-gradient p-2 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              WorkWise AI
            </h1>
            <p className="text-[11px] text-gray-400 font-medium">AI Assistant · 360°</p>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────── */}
      <div className="flex-1 mt-2">
        <QuickActions onQuickAction={onQuickAction} />
      </div>

      {/* ── Footer ───────────────────────────────── */}
      <div className="mt-auto pt-5 border-t border-white/5 space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClearChat}
          className="w-full flex items-center gap-2 justify-center py-2.5 rounded-lg text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
        >
          <Trash2 size={16} />
          <span>Clear Chat</span>
        </motion.button>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="text-xs text-cyan-400">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
