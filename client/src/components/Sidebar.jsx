import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Pencil, LogOut, ChevronLeft, ChevronRight, MessageSquare, Trash2 } from 'lucide-react';
import SparkMark from './SparkMark';
import { useAuth } from '../context/AuthContext';
import { useChatSessions } from '../context/ChatContext';

function Avatar({ src, name, size = 44 }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center overflow-hidden shrink-0 border"
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


export default function Sidebar({ typing }) {
  const { profile, updateAvatar, logout } = useAuth();
  const { sessions, activeSessionId, createSession, selectSession, deleteSession } = useChatSessions();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(true);

  const isLocker = location.pathname === '/locker';

  const handleEditPhoto = (e) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleAvatarFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNewChat = () => {
    createSession(profile.name || '');
    navigate('/chat');
  };

  const handleOpenChat = (id) => {
    selectSession(id);
    navigate('/chat');
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed z-50 left-0 top-1/2 -translate-y-1/2 rounded-r-xl px-1.5 py-4 border"
        style={{ background: 'rgba(26,20,64,0.9)', borderColor: 'rgba(255,255,255,0.12)', color: '#c9c4e6' }}
        aria-label="Show sidebar"
        title="Show sidebar"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    );
  }

  return (
    <div
      className="relative z-10 h-screen w-56 flex flex-col py-4 border-r backdrop-blur-xl shrink-0"
      style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-4 mb-4">
        <div className="flex items-center gap-2">
          <SparkMark pulsing={typing} size={11} />
          <p className="text-[13px] font-semibold tracking-wide" style={{ color: '#e9e6ff' }}>Inspi.Ai</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="p-1 rounded-md hover:bg-white/10 transition-colors"
          style={{ color: '#8f89b8' }}
          aria-label="Hide sidebar"
          title="Hide sidebar"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Avatar + logout — pfp on the right, logout on the left */}
      <div className="flex items-center justify-between px-4 mb-4 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <button
          type="button"
          onClick={handleLogout}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          style={{ color: '#c9c4e6' }}
          aria-label="Log out"
          title="Log out"
        >
          <LogOut className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => navigate('/locker')}
          className="relative rounded-full transition-transform hover:scale-105"
          style={{ outline: isLocker ? '2px solid #c4b5fd' : 'none', outlineOffset: 2, borderRadius: '9999px' }}
          aria-label="Open Personal Space"
          title="Personal Space"
        >
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarFile} />
          <Avatar src={profile.avatar} name={profile.name || profile.email} size={40} />
          <span
            onClick={handleEditPhoto}
            role="button"
            aria-label="Change profile photo"
            className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center border"
            style={{ background: '#1a1440', borderColor: 'rgba(255,255,255,0.2)', width: 18, height: 18 }}
          >
            <Pencil className="w-2.5 h-2.5" style={{ color: '#c9c4e6' }} />
          </span>
        </button>
      </div>

      {/* New chat */}
      <div className="px-3 mb-2">
        <button
          type="button"
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#e9e6ff' }}
        >
          <Plus className="w-4 h-4" /> New chat
        </button>
      </div>

      {/* Previous chats */}
      <p className="px-4 text-[11px] uppercase tracking-wide mt-2 mb-1" style={{ color: '#8f89b8' }}>
        Previous chats
      </p>
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
        {sessions.length === 0 ? (
          <p className="px-2 py-3 text-xs" style={{ color: '#6b6693' }}>No conversations yet.</p>
        ) : (
          sessions.map((s) => (
            <div
              key={s.id}
              className="group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors"
              style={{ background: s.id === activeSessionId ? 'rgba(167,139,250,0.16)' : 'transparent' }}
              onClick={() => handleOpenChat(s.id)}
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" style={{ color: s.id === activeSessionId ? '#c4b5fd' : '#8f89b8' }} />
              <span className="flex-1 truncate text-xs" style={{ color: s.id === activeSessionId ? '#e9e6ff' : '#c9c4e6' }}>
                {s.title || 'New conversation'}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(s.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/10 transition-opacity"
                style={{ color: '#8f89b8' }}
                aria-label="Delete chat"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}