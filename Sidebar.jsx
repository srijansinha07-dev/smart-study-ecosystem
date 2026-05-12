import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, FileText, BarChart3, Zap, Settings, GraduationCap } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar({ activePage, setActivePage }) {
  const { stats, completedTasks, totalTasks } = useApp();
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-64 flex-shrink-0 flex flex-col h-full glass border-r border-white/[0.06] p-4 gap-2"
    >
      {/* Logo */}
      <div className="px-2 py-3 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center shadow-glow-sm">
            <GraduationCap size={18} className="text-accent-soft" />
          </div>
          <div>
            <div className="font-display font-bold text-sm text-white leading-none">Smart Study</div>
            <div className="text-xs text-white/30 mt-0.5 font-body">Ecosystem</div>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 flex-1">
        <div className="text-[10px] uppercase tracking-widest text-white/20 font-display px-3 mb-1">Navigation</div>
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 + 0.2 }}
            >
              <Icon size={16} className={isActive ? 'text-accent-soft' : ''} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-soft"
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Streak badge */}
      <div className="card p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border-amber-500/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-display text-amber-300/80">Study Streak</span>
          <Zap size={13} className="text-amber-400" />
        </div>
        <div className="font-display font-bold text-2xl text-amber-300">{stats.streak}<span className="text-sm text-amber-300/50 ml-1">days</span></div>
        <div className="mt-3 progress-bar">
          <motion.div
            className="progress-fill bg-gradient-to-r from-amber-500 to-orange-400"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((stats.streak / 7) * 100, 100)}%` }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </div>
        <div className="text-[10px] text-amber-300/40 mt-1 font-body">Weekly goal: 7 days</div>
      </div>

      {/* Progress */}
      <div className="card p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-display text-white/50">Today's Tasks</span>
          <span className="text-xs font-mono text-accent-soft">{completedTasks}/{totalTasks}</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill bg-gradient-to-r from-accent to-accent-soft"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 0.6, duration: 0.8 }}
          />
        </div>
        <div className="text-[10px] text-white/20 mt-1">{progress}% complete</div>
      </div>

      {/* Settings */}
      <button className="nav-item nav-item-inactive mt-1">
        <Settings size={16} />
        Settings
      </button>
    </motion.aside>
  );
}
