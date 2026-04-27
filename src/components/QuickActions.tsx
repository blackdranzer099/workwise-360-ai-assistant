import { motion } from 'framer-motion';
import { LayoutDashboard, Bell, CalendarCheck, LifeBuoy, Briefcase } from 'lucide-react';

interface QuickActionsProps {
  onQuickAction: (action: string) => void;
}

export function QuickActions({ onQuickAction }: QuickActionsProps) {
  const quickActions = [
    { label: 'Daily Summary', icon: LayoutDashboard, query: 'Give me my workday summary' },
    { label: 'Notifications', icon: Bell, query: 'Do I have notifications today?' },
    { label: 'Attendance', icon: CalendarCheck, query: 'What is my attendance?' },
    { label: 'Support Requests', icon: LifeBuoy, query: 'Any pending support requests?' },
    { label: 'Assigned Projects', icon: Briefcase, query: 'Show my projects' },
  ];

  return (
    <>
      <h2 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 px-2">
        Quick Actions
      </h2>
      <div className="space-y-2">
        {quickActions.map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onQuickAction(action.query)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:text-white glass-button"
          >
            <action.icon size={18} className="text-cyan-400" />
            <span className="font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </>
  );
}
