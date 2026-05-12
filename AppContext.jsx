import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api.js';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [stats, setStats] = useState({ streak: 0, dailyGoal: 5, totalSessions: 0, lastActiveDate: '' });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [t, n, s] = await Promise.all([api.getTasks(), api.getNotes(), api.getStats()]);
      setTasks(t);
      setNotes(n);
      setStats(s);
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Derived stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const dailyCompleted = tasks.filter(t => {
    if (!t.completed) return false;
    const today = new Date().toDateString();
    return new Date(t.createdAt).toDateString() === today;
  }).length;

  const addTask = async (text, category) => {
    const task = await api.createTask(text, category);
    setTasks(prev => [...prev, task]);
    return task;
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    const updated = await api.updateTask(id, { completed: !task.completed });
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
  };

  const deleteTask = async (id) => {
    await api.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const saveNote = async (title, content) => {
    const note = await api.saveNote(title, content);
    setNotes(prev => {
      const exists = prev.find(n => n.id === note.id);
      return exists ? prev.map(n => n.id === note.id ? note : n) : [...prev, note];
    });
    return note;
  };

  const updateNote = async (id, data) => {
    const note = await api.updateNote(id, data);
    setNotes(prev => prev.map(n => n.id === id ? note : n));
    return note;
  };

  return (
    <AppContext.Provider value={{
      tasks, notes, stats, loading,
      totalTasks, completedTasks, progress, dailyCompleted,
      addTask, toggleTask, deleteTask,
      saveNote, updateNote,
      refresh,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
