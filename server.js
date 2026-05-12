const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage
let tasks = [
  { id: uuidv4(), text: 'Review Chapter 4 notes', completed: false, createdAt: new Date().toISOString(), category: 'study' },
  { id: uuidv4(), text: 'Complete practice problems', completed: true, createdAt: new Date().toISOString(), category: 'homework' },
  { id: uuidv4(), text: 'Watch lecture recording', completed: false, createdAt: new Date().toISOString(), category: 'study' },
];

let notes = [
  {
    id: uuidv4(),
    title: 'Study Notes',
    content: '## Key Concepts\n\nStart adding your study notes here. You can write in **markdown** format.\n\n- Important concept 1\n- Important concept 2\n\n## Reminders\n\nUse the focus timer for 25-minute deep work sessions.',
    updatedAt: new Date().toISOString(),
  }
];

let stats = {
  streak: 3,
  lastActiveDate: new Date().toDateString(),
  dailyGoal: 5,
  totalSessions: 12,
};

// ── Tasks ──────────────────────────────────────────────
app.get('/tasks', (req, res) => res.json(tasks));

app.post('/tasks', (req, res) => {
  const { text, category = 'general' } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Task text is required' });
  const task = { id: uuidv4(), text: text.trim(), completed: false, createdAt: new Date().toISOString(), category };
  tasks.push(task);
  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks[idx] = { ...tasks[idx], ...req.body, id: tasks[idx].id };
  res.json(tasks[idx]);
});

app.delete('/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(idx, 1);
  res.json({ success: true });
});

// ── Notes ──────────────────────────────────────────────
app.get('/notes', (req, res) => res.json(notes));

app.post('/notes', (req, res) => {
  const { title, content } = req.body;
  const existing = notes.find(n => n.title === title);
  if (existing) {
    existing.content = content;
    existing.updatedAt = new Date().toISOString();
    return res.json(existing);
  }
  const note = { id: uuidv4(), title: title || 'Untitled', content: content || '', updatedAt: new Date().toISOString() };
  notes.push(note);
  res.status(201).json(note);
});

app.put('/notes/:id', (req, res) => {
  const idx = notes.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });
  notes[idx] = { ...notes[idx], ...req.body, id: notes[idx].id, updatedAt: new Date().toISOString() };
  res.json(notes[idx]);
});

// ── Stats ──────────────────────────────────────────────
app.get('/stats', (req, res) => {
  const today = new Date().toDateString();
  if (stats.lastActiveDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (stats.lastActiveDate === yesterday.toDateString()) {
      stats.streak += 1;
    } else {
      stats.streak = 1;
    }
    stats.lastActiveDate = today;
  }
  res.json(stats);
});

app.put('/stats', (req, res) => {
  stats = { ...stats, ...req.body };
  res.json(stats);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Smart Study API running on http://localhost:${PORT}`));
