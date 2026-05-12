import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle2, Circle, Filter, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const CATEGORIES = ['all', 'study', 'homework', 'reading', 'general'];
const CAT_COLORS = {
  study: 'text-accent-soft bg-accent/10 border-accent/20',
  homework: 'text-jade bg-teal-500/10 border-teal-500/20',
  reading: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  general: 'text-white/40 bg-white/5 border-white/10',
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const taskVariant = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 20, height: 0, marginBottom: 0, transition: { duration: 0.25 } }
};

export default function Tasks() {
  const { tasks, addTask, toggleTask, deleteTask } = useApp();
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('general');
  const [filter, setFilter] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);

  const filtered = tasks.filter(t => {
    if (filter !== 'all' && t.category !== filter) return false;
    if (filterStatus === 'active' && t.completed) return false;
    if (filterStatus === 'done' && !t.completed) return false;
    return true;
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    setLoading(true);
    try {
      await addTask(input.trim(), category);
      setInput('');
    } finally {
      setLoading(false);
    }
  };

  const pending = tasks.filter(t => !t.completed).length;
  const done = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-white">Task Manager</h1>
        <p className="text-white/40 text-sm mt-1">{pending} pending · {done} completed</p>
      </motion.div>

      {/* Add task form */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card space-y-3">
        <div className="text-xs font-display text-white/40 uppercase tracking-wider">New Task</div>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="What needs to be done?"
            className="input-field flex-1"
            maxLength={120}
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="input-field w-auto px-3 cursor-pointer"
          >
            {CATEGORIES.filter(c => c !== 'all').map(c => (
              <option key={c} value={c} className="bg-surface capitalize">{c}</option>
            ))}
          </select>
          <button type="submit" disabled={loading || !input.trim()} className="btn-primary flex items-center gap-1.5 whitespace-nowrap">
            <Plus size={16} />Add
          </button>
        </form>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1 text-white/30">
          <Filter size={13} />
          <span className="text-xs font-display">Category:</span>
        </div>
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`text-xs px-3 py-1.5 rounded-lg font-display border transition-all capitalize ${
              filter === c ? 'bg-accent/20 text-accent-soft border-accent/30' : 'border-white/10 text-white/40 hover:text-white/60'
            }`}
          >
            {c}
          </button>
        ))}
        <div className="ml-4 flex gap-1">
          {['all', 'active', 'done'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-display border transition-all capitalize ${
                filterStatus === s ? 'bg-white/10 text-white border-white/20' : 'border-white/5 text-white/30 hover:text-white/50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Task list */}
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card text-center py-12">
              <div className="text-4xl mb-3">✅</div>
              <div className="text-white/40 font-body text-sm">No tasks here. All clear!</div>
            </motion.div>
          )}
          {filtered.map(task => (
            <motion.div
              key={task.id}
              variants={taskVariant}
              layout
              exit="exit"
              className={`card flex items-center gap-3 group transition-all ${task.completed ? 'opacity-50' : ''}`}
            >
              <button onClick={() => toggleTask(task.id)} className="flex-shrink-0 transition-transform hover:scale-110">
                {task.completed
                  ? <CheckCircle2 size={20} className="text-jade" />
                  : <Circle size={20} className="text-white/20 hover:text-accent-soft" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-body ${task.completed ? 'line-through text-white/30' : 'text-white/80'}`}>
                  {task.text}
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-display border capitalize ${CAT_COLORS[task.category] || CAT_COLORS.general}`}>
                    {task.category}
                  </span>
                  <span className="text-[10px] text-white/20 font-mono">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity btn-ghost !px-2 !py-2 text-ember hover:text-rose-300"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
