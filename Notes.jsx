import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, FileText, Clock, CheckCheck } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Notes() {
  const { notes, saveNote, updateNote } = useApp();
  const [activeId, setActiveId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimeout = useRef(null);

  const activeNote = notes.find(n => n.id === activeId);

  useEffect(() => {
    if (notes.length > 0 && !activeId) {
      const n = notes[0];
      setActiveId(n.id);
      setTitle(n.title);
      setContent(n.content);
    }
  }, [notes]);

  const selectNote = (note) => {
    setActiveId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSaved(true);
  };

  const handleChange = (newContent) => {
    setContent(newContent);
    setSaved(false);
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => autoSave(newContent), 1500);
  };

  const autoSave = async (c) => {
    if (!activeId) return;
    setSaving(true);
    try {
      await updateNote(activeId, { title, content: c });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeId) {
        await updateNote(activeId, { title, content });
      } else {
        await saveNote(title || 'Untitled', content);
      }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const handleNew = async () => {
    const note = await saveNote(`Note ${notes.length + 1}`, '');
    setActiveId(note.id);
    setTitle(note.title);
    setContent('');
    setSaved(true);
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Notes</h1>
          <p className="text-white/40 text-sm mt-1">{notes.length} note{notes.length !== 1 ? 's' : ''} saved</p>
        </div>
        <button onClick={handleNew} className="btn-primary flex items-center gap-2">
          <Plus size={15} />New Note
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" style={{ minHeight: 520 }}>
        {/* Note list */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 card space-y-2 overflow-y-auto"
          style={{ maxHeight: 560 }}
        >
          <div className="text-xs font-display text-white/30 uppercase tracking-wider mb-3">All Notes</div>
          {notes.length === 0 && (
            <div className="text-center py-8">
              <FileText size={24} className="text-white/20 mx-auto mb-2" />
              <p className="text-xs text-white/30">No notes yet</p>
            </div>
          )}
          {notes.map(note => (
            <button
              key={note.id}
              onClick={() => selectNote(note)}
              className={`w-full text-left p-3 rounded-xl transition-all ${
                activeId === note.id
                  ? 'bg-accent/15 border border-accent/25'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="font-display text-sm font-medium text-white/80 truncate">{note.title}</div>
              <div className="text-xs text-white/30 mt-1 line-clamp-2 font-body leading-relaxed">
                {note.content.replace(/[#*`]/g, '').slice(0, 60) || 'Empty note'}
              </div>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-white/20">
                <Clock size={9} />
                {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </button>
          ))}
        </motion.div>

        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3 card flex flex-col gap-3"
          style={{ minHeight: 520 }}
        >
          {/* Editor header */}
          <div className="flex items-center gap-3 pb-3 border-b border-white/[0.06]">
            <input
              value={title}
              onChange={e => { setTitle(e.target.value); setSaved(false); }}
              className="font-display font-bold text-lg text-white bg-transparent outline-none flex-1 placeholder-white/20"
              placeholder="Note title..."
            />
            <div className="flex items-center gap-2">
              {saving && <span className="text-xs text-white/30 font-body flex items-center gap-1"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse inline-block" />saving...</span>}
              {!saving && saved && activeId && <span className="text-xs text-jade font-body flex items-center gap-1"><CheckCheck size={12} />saved</span>}
              <button onClick={handleSave} className="btn-primary flex items-center gap-1.5 text-xs">
                <Save size={13} />Save
              </button>
            </div>
          </div>

          {/* Textarea */}
          {activeId || true ? (
            <textarea
              value={content}
              onChange={e => handleChange(e.target.value)}
              placeholder={`Start writing your notes here...\n\nTips:\n• Use ## for headings\n• Use - for bullet points\n• Use **bold** for emphasis`}
              className="flex-1 bg-transparent text-white/70 font-body text-sm leading-relaxed resize-none outline-none placeholder-white/20 min-h-[400px]"
              spellCheck
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/20">
              <FileText size={40} className="mb-3" />
              <p className="font-body text-sm">Select a note or create a new one</p>
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-xs text-white/20 font-mono">{content.length} chars · {content.split(/\s+/).filter(Boolean).length} words</span>
            {activeNote && (
              <span className="text-xs text-white/20 font-body flex items-center gap-1">
                <Clock size={10} />Last saved {new Date(activeNote.updatedAt).toLocaleTimeString()}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
