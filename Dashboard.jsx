import { motion } from 'framer-motion';
import { CheckCircle2, Circle, TrendingUp, Target, Flame, Clock, BookOpen, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } }
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
};

function StatCard({ icon: Icon, label, value, sub, color, gradient }) {
  return (
    <motion.div variants={item} className="stat-card">
      <div className={`absolute inset-0 opacity-10 rounded-2xl bg-gradient-to-br ${gradient}`} />
      <div className="flex justify-between items-start relative">
        <div>
          <div className="text-xs font-display text-white/40 uppercase tracking-wider mb-1">{label}</div>
          <div className={`text-3xl font-display font-bold ${color}`}>{value}</div>
          {sub && <div className="text-xs text-white/30 mt-1 font-body">{sub}</div>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradient} bg-opacity-20 border border-white/10`}>
          <Icon size={18} className={color} />
        </div>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { tasks, completedTasks, totalTasks, progress, dailyCompleted, stats } = useApp();
  const recentTasks = [...tasks].slice(-5).reverse();
  const dailyGoalPct = Math.min((dailyCompleted / stats.dailyGoal) * 100, 100);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header */}
      <motion.div variants={item} className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Good {getGreeting()} 👋</h1>
          <p className="text-white/40 text-sm font-body mt-1">Here's your study overview for today</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/30 font-body">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckCircle2} label="Completed" value={completedTasks} sub={`of ${totalTasks} tasks`} color="text-jade" gradient="from-teal-500 to-cyan-600" />
        <StatCard icon={TrendingUp} label="Progress" value={`${progress}%`} sub="overall completion" color="text-accent-soft" gradient="from-violet-500 to-purple-600" />
        <StatCard icon={Flame} label="Streak" value={`${stats.streak}d`} sub="days in a row" color="text-amber-300" gradient="from-amber-500 to-orange-500" />
        <StatCard icon={Target} label="Daily Goal" value={`${dailyCompleted}/${stats.dailyGoal}`} sub="tasks today" color="text-rose-300" gradient="from-rose-500 to-pink-600" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Progress overview */}
        <motion.div variants={item} className="card lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-white text-base">Overall Progress</h2>
            <span className="text-xs font-mono text-accent-soft bg-accent/10 px-2 py-1 rounded-lg">{progress}%</span>
          </div>

          <div>
            <div className="flex justify-between text-xs text-white/40 mb-2 font-body">
              <span>Task Completion</span>
              <span>{completedTasks}/{totalTasks}</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent via-accent-soft to-jade"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-white/40 mb-2 font-body">
              <span>Daily Goal</span>
              <span>{dailyCompleted}/{stats.dailyGoal} tasks</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400"
                initial={{ width: 0 }}
                animate={{ width: `${dailyGoalPct}%` }}
                transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Week visualization */}
          <div>
            <div className="text-xs text-white/40 font-body mb-3">This Week</div>
            <div className="flex gap-2">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
                const today = new Date().getDay();
                const dayMap = [6, 0, 1, 2, 3, 4, 5]; // Mon=0
                const isToday = dayMap[today] === i;
                const isPast = dayMap[today] > i;
                const height = isPast ? [60, 80, 45, 90, 70][i % 5] : isToday ? Math.max(20, dailyGoalPct) : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-white/5 rounded-lg overflow-hidden" style={{ height: 48 }}>
                      <motion.div
                        className={`w-full rounded-lg ${isToday ? 'bg-gradient-to-t from-accent to-accent-soft' : isPast ? 'bg-white/10' : 'bg-transparent'}`}
                        style={{ height: `${height}%`, marginTop: 'auto' }}
                        initial={{ height: '0%' }}
                        animate={{ height: `${height}%` }}
                        transition={{ delay: i * 0.05 + 0.6, duration: 0.5 }}
                      />
                    </div>
                    <span className={`text-[10px] font-display ${isToday ? 'text-accent-soft' : 'text-white/20'}`}>{d}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Recent tasks */}
          <motion.div variants={item} className="card space-y-3">
            <h2 className="font-display font-semibold text-white text-base">Recent Tasks</h2>
            {recentTasks.length === 0 ? (
              <p className="text-white/30 text-sm font-body">No tasks yet. Add some!</p>
            ) : (
              recentTasks.map(task => (
                <div key={task.id} className="flex items-start gap-2.5 py-1">
                  {task.completed
                    ? <CheckCircle2 size={15} className="text-jade mt-0.5 flex-shrink-0" />
                    : <Circle size={15} className="text-white/20 mt-0.5 flex-shrink-0" />
                  }
                  <span className={`text-xs font-body leading-relaxed ${task.completed ? 'line-through text-white/30' : 'text-white/70'}`}>
                    {task.text}
                  </span>
                </div>
              ))
            )}
          </motion.div>

          {/* Quick insights */}
          <motion.div variants={item} className="card space-y-3 bg-gradient-to-br from-accent/5 to-transparent border-accent/10">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-accent-soft" />
              <h2 className="font-display font-semibold text-white text-sm">Quick Insights</h2>
            </div>
            <div className="space-y-2 text-xs text-white/50 font-body leading-relaxed">
              {progress >= 80 && <p className="text-jade">🔥 Excellent! You're almost done!</p>}
              {progress < 20 && totalTasks > 0 && <p className="text-amber-300">💪 Get started — tackle one task at a time.</p>}
              {stats.streak >= 3 && <p>🏆 {stats.streak}-day streak! Keep it going.</p>}
              {totalTasks === 0 && <p>📝 Add your first task to begin tracking.</p>}
              <p>⏱ Use the Pomodoro timer for deep work sessions.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
