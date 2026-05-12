import { motion } from 'framer-motion';
import { TrendingUp, Award, Zap, Target, CheckCircle2, BarChart2 } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

function BarChart({ data, label, color = 'bg-accent' }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div>
      <div className="text-xs font-display text-white/40 uppercase tracking-wider mb-4">{label}</div>
      <div className="flex items-end gap-2 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              className={`w-full rounded-t-lg ${color} opacity-80`}
              initial={{ height: 0 }}
              animate={{ height: `${(d.value / max) * 100}%` }}
              transition={{ delay: i * 0.05 + 0.3, duration: 0.5, ease: 'easeOut' }}
              title={`${d.value}`}
            />
            <span className="text-[10px] text-white/30 font-display">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, title, value, description, color }) {
  return (
    <motion.div variants={item} className="card space-y-2">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={15} className="text-white" />
        </div>
        <span className="text-xs font-display text-white/50 uppercase tracking-wider">{title}</span>
      </div>
      <div className="font-display font-bold text-2xl text-white">{value}</div>
      <div className="text-xs text-white/30 font-body leading-relaxed">{description}</div>
    </motion.div>
  );
}

export default function Analytics() {
  const { tasks, stats, completedTasks, totalTasks, progress } = useApp();

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const byCategory = ['study', 'homework', 'reading', 'general'].map(cat => ({
    label: cat.slice(0, 3).toUpperCase(),
    value: tasks.filter(t => t.category === cat && t.completed).length,
  }));

  const pendingByCategory = ['study', 'homework', 'reading', 'general'].map(cat => ({
    label: cat.slice(0, 3).toUpperCase(),
    value: tasks.filter(t => t.category === cat && !t.completed).length,
  }));

  const weekData = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => ({
    label: d,
    value: Math.floor(Math.random() * 8 + 1), // simulated historical data
  }));

  const productivityScore = Math.min(100, Math.round(
    (completionRate * 0.4) + (Math.min(stats.streak, 7) / 7 * 40) + (Math.min(completedTasks, 10) / 10 * 20)
  ));

  const getProductivityLabel = (score) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-jade' };
    if (score >= 60) return { label: 'Good', color: 'text-accent-soft' };
    if (score >= 40) return { label: 'Fair', color: 'text-amber-300' };
    return { label: 'Needs Work', color: 'text-ember' };
  };

  const { label: prodLabel, color: prodColor } = getProductivityLabel(productivityScore);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <h1 className="font-display text-2xl font-bold text-white">Analytics</h1>
        <p className="text-white/40 text-sm mt-1">Your study performance insights</p>
      </motion.div>

      {/* Key insights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightCard
          icon={TrendingUp} title="Completion" value={`${completionRate}%`}
          description={`${completedTasks} of ${totalTasks} tasks completed`}
          color="bg-accent/30"
        />
        <InsightCard
          icon={Award} title="Streak" value={`${stats.streak} days`}
          description="Consecutive days of activity"
          color="bg-amber-500/30"
        />
        <InsightCard
          icon={Target} title="Daily Goal" value={`${Math.round((stats.dailyGoal || 5) > 0 ? Math.min(((tasks.filter(t=>t.completed).length) / (stats.dailyGoal || 5)) * 100, 100) : 0)}%`}
          description={`${stats.dailyGoal || 5} tasks per day target`}
          color="bg-jade/30"
        />
        <InsightCard
          icon={Zap} title="Score" value={productivityScore}
          description={`Productivity: ${prodLabel}`}
          color="bg-rose-500/30"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div variants={item} className="card lg:col-span-2 space-y-6">
          <h2 className="font-display font-semibold text-white">Weekly Activity</h2>
          <BarChart data={weekData} label="Tasks completed per day" color="bg-gradient-to-t from-accent to-accent-soft" />
        </motion.div>

        <motion.div variants={item} className="card space-y-4">
          <h2 className="font-display font-semibold text-white">Productivity Score</h2>
          <div className="flex flex-col items-center py-4">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <motion.circle
                  cx="60" cy="60" r="50"
                  fill="none"
                  stroke="url(#scoreGrad)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 50}
                  strokeDashoffset={2 * Math.PI * 50 * (1 - productivityScore / 100)}
                  initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - productivityScore / 100) }}
                  transition={{ duration: 1.2, delay: 0.5 }}
                />
                <defs>
                  <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4ecdc4" />
                    <stop offset="100%" stopColor="#7c6fff" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-bold text-3xl text-white">{productivityScore}</span>
                <span className={`text-xs font-display ${prodColor}`}>{prodLabel}</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Completion Rate', value: completionRate, color: 'bg-accent' },
              { label: 'Streak Bonus', value: Math.min((stats.streak / 7) * 100, 100), color: 'bg-amber-500' },
              { label: 'Volume Score', value: Math.min((completedTasks / 10) * 100, 100), color: 'bg-jade' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-[11px] text-white/40 mb-1 font-body">
                  <span>{label}</span>
                  <span>{Math.round(value)}%</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    className={`progress-fill ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ delay: 0.8, duration: 0.7 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div variants={item} className="card">
          <BarChart data={byCategory} label="Completed by category" color="bg-jade" />
        </motion.div>
        <motion.div variants={item} className="card">
          <BarChart data={pendingByCategory} label="Pending by category" color="bg-ember" />
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div variants={item} className="card bg-gradient-to-br from-accent/5 to-transparent border-accent/10">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={16} className="text-accent-soft" />
          <h2 className="font-display font-semibold text-white">Recommendations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/50 font-body">
          <div className="space-y-1">
            <div className="text-white/70 font-display text-xs uppercase tracking-wider mb-2">📈 Growth</div>
            <p>{completionRate < 50 ? 'Focus on completing existing tasks before adding new ones.' : 'Great pace! Try increasing your daily goal by 1–2 tasks.'}</p>
          </div>
          <div className="space-y-1">
            <div className="text-white/70 font-display text-xs uppercase tracking-wider mb-2">⏱ Focus</div>
            <p>Use 25-minute Pomodoro sessions. Aim for 4 sessions per study day for optimal retention.</p>
          </div>
          <div className="space-y-1">
            <div className="text-white/70 font-display text-xs uppercase tracking-wider mb-2">🧠 Retention</div>
            <p>Take notes after each study session. Writing helps consolidate long-term memory.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
