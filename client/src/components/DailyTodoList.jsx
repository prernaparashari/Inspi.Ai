import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import { useLocker } from '../context/LockerContext';

function formatDateLabel(dateKey) {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dateKey === today) return 'Today';
  if (dateKey === yesterday) return 'Yesterday';
  return new Date(dateKey).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DailyTodoList() {
  const { todos, addTodo, toggleTodo, removeTodo } = useLocker();
  const [draft, setDraft] = useState('');
  const todayKey = new Date().toISOString().slice(0, 10);

  const handleAdd = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    addTodo(text, todayKey);
    setDraft('');
  };

  
  const groups = todos.reduce((acc, t) => {
    (acc[t.date] = acc[t.date] || []).push(t);
    return acc;
  }, {});
  const sortedDates = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div>
      <div
        className="rounded-2xl p-4 border mb-6"
        style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <p className="text-sm font-medium mb-2" style={{ color: '#e9e6ff' }}>Add a task for today</p>
        <form onSubmit={handleAdd} className="flex items-center gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="What do you need to get done?"
            className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none border"
            style={{ background: 'rgba(0,0,0,0.25)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="p-2.5 rounded-xl disabled:opacity-50 transition-all"
            style={{ background: 'linear-gradient(90deg,#818cf8,#a78bfa)', color: '#140f2b' }}
            aria-label="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>
      </div>

      {sortedDates.length === 0 ? (
        <div
          className="rounded-2xl border p-8 text-center text-sm"
          style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#8f89b8', background: 'rgba(255,255,255,0.03)' }}
        >
          No tasks yet. Add today's first one above.
        </div>
      ) : (
        <div className="space-y-5">
          {sortedDates.map((dateKey) => (
            <div key={dateKey}>
              <p className="text-xs uppercase tracking-wide mb-2" style={{ color: '#8f89b8' }}>
                {formatDateLabel(dateKey)}
              </p>
              <div className="space-y-1.5">
                {groups[dateKey].map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border"
                    style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleTodo(t.id)}
                      className="w-5 h-5 rounded-md flex items-center justify-center border shrink-0 transition-all"
                      style={{
                        background: t.done ? 'linear-gradient(90deg,#818cf8,#a78bfa)' : 'transparent',
                        borderColor: t.done ? 'transparent' : 'rgba(255,255,255,0.25)',
                      }}
                      aria-label={t.done ? 'Mark as not done' : 'Mark as done'}
                    >
                      {t.done && <Check className="w-3 h-3" style={{ color: '#140f2b' }} />}
                    </button>
                    <span
                      className="flex-1 text-sm"
                      style={{
                        color: t.done ? '#8f89b8' : '#e9e6ff',
                        textDecoration: t.done ? 'line-through' : 'none',
                      }}
                    >
                      {t.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTodo(t.id)}
                      className="shrink-0 p-1 rounded-md hover:bg-white/10"
                      style={{ color: '#8f89b8' }}
                      aria-label="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}