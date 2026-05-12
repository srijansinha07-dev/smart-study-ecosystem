import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer, X, ChevronDown } from 'lucide-react';

const MODES = [
  { label: 'Focus', minutes: 25, color: 'from-accent to-accent-glow' },
  { label: 'Short Break', minutes: 5, color: 'from-jade to-teal-600' },
  { label: 'Long Break', minutes: 15, color: 'from-ember to-rose-600' },
];

export default function FocusTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [modeIdx, setModeIdx] = useState(0);
  const [seconds, setSeconds] = useState(MODES[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const mode = MODES[modeIdx];
  const total = mode.minutes * 60;
  const pct = ((total - seconds) / total) * 100;
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => {
          if (s <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0; }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const selectMode = (i) => {
    setModeIdx(i);
    setSeconds(MODES[i].minutes * 60);
    setRunning(false);
  };

  const reset = () => {
    setSeconds(mode.minutes * 60);
    setRunning(false);
  };

  const circumference = 2 * Math.PI * 54;

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-accent shadow-glow flex items-center justify-center hover:scale-110 transition-transform"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Timer size={22} className="text-white" />
            {running && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-jade animate-pulse border-2 border-void" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Timer panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-72 glass-strong rounded-2xl overflow-hidden shadow-glow"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Timer size={15} className="text-accent-soft" />
                <span className="text-sm font-display font-semibold text-white">Focus Timer</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setIsMinimized(v => !v)} className="btn-ghost !px-2 !py-1 text-white/40">
                  <ChevronDown size={14} className={`transition-transform ${isMinimized ? 'rotate-180' : ''}`} />
                </button>
                <button onClick={() => { setIsOpen(false); }} className="btn-ghost !px-2 !py-1 text-white/40">
                  <X size={14} />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {/* Mode tabs */}
                  <div className="flex gap-1 p-3 pb-0">
                    {MODES.map((m, i) => (
                      <button
                        key={m.label}
                        onClick={() => selectMode(i)}
                        className={`flex-1 text-[11px] py-1.5 rounded-lg font-display transition-all ${
                          modeIdx === i ? 'bg-accent/20 text-accent-soft border border-accent/30' : 'text-white/30 hover:text-white/60'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Timer circle */}
                  <div className="flex flex-col items-center py-6">
                    <div className="relative w-36 h-36">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <motion.circle
                          cx="60" cy="60" r="54"
                          fill="none"
                          stroke="url(#timerGrad)"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={circumference - (pct / 100) * circumference}
                          transition={{ duration: 0.5 }}
                        />
                        <defs>
                          <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#7c6fff" />
                            <stop offset="100%" stopColor="#a594ff" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-mono text-3xl font-bold text-white">{mins}:{secs}</span>
                        <span className="text-xs text-white/30 font-body">{mode.label}</span>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-3 mt-4">
                      <button onClick={reset} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all">
                        <RotateCcw size={14} className="text-white/50" />
                      </button>
                      <motion.button
                        onClick={() => setRunning(v => !v)}
                        className="w-12 h-12 rounded-xl bg-accent hover:bg-accent-soft flex items-center justify-center shadow-glow-sm transition-all"
                        whileTap={{ scale: 0.92 }}
                      >
                        {running ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                      </motion.button>
                    </div>

                    {running && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 text-xs text-jade font-body flex items-center gap-1"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse inline-block" />
                        Session in progress
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
