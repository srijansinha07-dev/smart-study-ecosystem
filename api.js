const BASE = '/';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getTasks: () => request('tasks'),
  createTask: (text, category) => request('tasks', { method: 'POST', body: JSON.stringify({ text, category }) }),
  updateTask: (id, data) => request(`tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (id) => request(`tasks/${id}`, { method: 'DELETE' }),

  getNotes: () => request('notes'),
  saveNote: (title, content) => request('notes', { method: 'POST', body: JSON.stringify({ title, content }) }),
  updateNote: (id, data) => request(`notes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  getStats: () => request('stats'),
  updateStats: (data) => request('stats', { method: 'PUT', body: JSON.stringify(data) }),
};
