import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChatSessions } from '../context/ChatContext';
import { sendChatMessage } from '../services/api';

function Avatar({ src, name, size = 28 }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div
      className="relative rounded-full flex items-center justify-center overflow-hidden shrink-0 border"
      style={{
        width: size,
        height: size,
        borderColor: 'rgba(255,255,255,0.2)',
        background: src ? 'transparent' : 'linear-gradient(135deg,#818cf8,#a78bfa)',
      }}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white font-semibold" style={{ fontSize: size * 0.4 }}>{initial}</span>
      )}
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: '#c4b5fd', animation: `bounceDot 1s ${i * 0.15}s infinite ease-in-out` }}
        />
      ))}
      <style>{`
        @keyframes bounceDot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function ChatWindow({ typing, setTyping }) {
  const { profile } = useAuth();
  const { activeSession, ensureSession, updateSessionMessages } = useChatSessions();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  
  useEffect(() => {
    if (!activeSession) {
      ensureSession(profile.name || '');
    }
  }, [activeSession, ensureSession, profile.name]);

  const messages = activeSession?.messages || [];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, typing]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || typing || !activeSession) return;

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text };
    const history = messages.map((m) => ({ role: m.role, text: m.text }));
    const afterUser = [...messages, userMsg];
    updateSessionMessages(activeSession.id, afterUser);
    setInput('');
    setTyping(true);

    const reply = await sendChatMessage(text, history);

    setTyping(false);
    updateSessionMessages(activeSession.id, [...afterUser, { id: `a-${Date.now()}`, role: 'ai', text: reply }]);
  };

  return (
    <div className="flex flex-col flex-1 relative z-10 h-screen">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 max-w-2xl w-full mx-auto space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex items-end gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'ai' && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa)' }}>
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div
              className="max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              style={
                m.role === 'user'
                  ? { background: 'linear-gradient(90deg,#818cf8,#a78bfa)', color: '#140f2b' }
                  : { background: 'rgba(255,255,255,0.08)', color: '#e9e6ff', border: '1px solid rgba(255,255,255,0.1)' }
              }
            >
              {m.text}
            </div>
            {m.role === 'user' && <Avatar src={profile.avatar} name={profile.name || profile.email} size={28} />}
          </div>
        ))}

        {typing && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa)' }}>
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="rounded-2xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="max-w-2xl w-full mx-auto px-4 pb-6 pt-2 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message Inspi.Ai…"
          className="flex-1 px-4 py-3 rounded-xl text-sm text-white outline-none border transition-all focus:border-indigo-300"
          style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.12)' }}
        />
        <button
          type="submit"
          disabled={!input.trim() || typing}
          className="p-3 rounded-xl disabled:opacity-50 transition-all"
          style={{ background: 'linear-gradient(90deg,#818cf8,#a78bfa)', color: '#140f2b' }}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}