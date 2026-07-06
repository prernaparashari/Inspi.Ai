import React, { useState } from 'react';
import { Loader2, Sparkles, Trash2, Send } from 'lucide-react';
import { useLocker } from '../context/LockerContext';
import { sendChatMessage } from '../services/api';

export default function PersonalDiary() {
  const { diaryEntries, addDiaryEntry, removeDiaryEntry } = useLocker();
  const [draft, setDraft] = useState('');
  const [asking, setAsking] = useState(false);
  const [pendingReply, setPendingReply] = useState(null); 

  const handleSaveOnly = () => {
    const text = draft.trim();
    if (!text) return;
    addDiaryEntry(text, null);
    setDraft('');
    setPendingReply(null);
  };

  const handleAskAi = async () => {
    const text = draft.trim();
    if (!text || asking) return;
    setAsking(true);
    const reply = await sendChatMessage(text, []);
    setAsking(false);
    setPendingReply(reply);
    addDiaryEntry(text, reply);
    setDraft('');
  };

  return (
    <div>
      {/* Write box */}
      <div
        className="rounded-2xl p-4 border mb-6"
        style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <p className="text-sm font-medium mb-2" style={{ color: '#e9e6ff' }}>Write it down</p>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="What's on your mind today?"
          rows={4}
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border resize-none"
          style={{ background: 'rgba(0,0,0,0.25)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
        />
        <div className="flex items-center justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={handleSaveOnly}
            disabled={!draft.trim() || asking}
            className="px-3 py-2 rounded-xl text-xs font-medium border disabled:opacity-50 transition-all"
            style={{ background: 'transparent', borderColor: 'rgba(255,255,255,0.15)', color: '#c9c4e6' }}
          >
            Just save
          </button>
          <button
            type="button"
            onClick={handleAskAi}
            disabled={!draft.trim() || asking}
            className="px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 disabled:opacity-60 transition-all"
            style={{ background: 'linear-gradient(90deg,#818cf8,#a78bfa)', color: '#140f2b' }}
          >
            {asking ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Asking…
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Ask Inspi.Ai
              </>
            )}
          </button>
        </div>
      </div>

      {/* Entries */}
      {diaryEntries.length === 0 ? (
        <div
          className="rounded-2xl border p-8 text-center text-sm"
          style={{ borderColor: 'rgba(255,255,255,0.1)', color: '#8f89b8', background: 'rgba(255,255,255,0.03)' }}
        >
          Your diary is empty. Write your first entry above — it stays just between you and Inspi.Ai.
        </div>
      ) : (
        <div className="space-y-3">
          {diaryEntries.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl p-4 border"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed" style={{ color: '#e9e6ff' }}>{entry.text}</p>
                <button
                  type="button"
                  onClick={() => removeDiaryEntry(entry.id)}
                  className="shrink-0 p-1 rounded-md hover:bg-white/10"
                  style={{ color: '#8f89b8' }}
                  aria-label="Delete entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: '#8f89b8' }}>
                {new Date(entry.writtenAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>

              {entry.aiReply && (
                <div
                  className="mt-3 rounded-xl px-3 py-2.5 text-sm leading-relaxed flex items-start gap-2"
                  style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', color: '#e9e6ff' }}
                >
                  <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#c4b5fd' }} />
                  <span className="flex-1">{entry.aiReply}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}