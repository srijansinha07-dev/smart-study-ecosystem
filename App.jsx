import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import FocusTimer from './components/FocusTimer.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tasks from './pages/Tasks.jsx';
import Notes from './pages/Notes.jsx';
import Analytics from './pages/Analytics.jsx';
import { Menu, X } from 'lucide-react';

const PAGES = {
  dashboard: Dashboard,
  tasks: Tasks,
  notes: Notes,
  analytics: Analytics,
};

const pageVariants = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

function AppShell() {
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const PageComponent = PAGES[activePage] || Dashboard;

  return (
    <div className="min-h-screen bg-void bg-mesh flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — desktop always visible, mobile slide-in */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto
        transform transition-transform duration-300 ease-out lg:transform-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-screen">
          <Sidebar activePage={activePage} setActivePage={(p) => { setActivePage(p); setSidebarOpen(false); }} />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top bar (mobile) */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 glass border-b border-white/[0.06] sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="btn-ghost !px-2 !py-2">
            <Menu size={18} />
          </button>
          <span className="font-display font-bold text-sm text-white capitalize">{activePage}</span>
          <div className="w-9" />
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <PageComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Focus Timer floating */}
      <FocusTimer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
