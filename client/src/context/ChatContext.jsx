import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext(null);
const STORAGE_KEY = 'inspiai:chats';

function makeWelcome(emailFirstName) {
  return {
    id: 'welcome',
    role: 'ai',
    text: `Welcome to Inspi.Ai${emailFirstName ? ', ' + emailFirstName : ''}! What are we creating today?`,
  };
}

function makeSession(emailFirstName) {
  return {
    id: `s-${Date.now()}`,
    title: 'New conversation',
    messages: [makeWelcome(emailFirstName)],
    updatedAt: new Date().toISOString(),
  };
}

export function ChatProvider({ children }) {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.sessions?.length) {
          setSessions(parsed.sessions);
          setActiveSessionId(parsed.activeSessionId || parsed.sessions[0].id);
        }
      }
    } catch (e) {
      // nothing saved yet
    }
  }, []);

  const persist = (nextSessions, nextActiveId) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ sessions: nextSessions, activeSessionId: nextActiveId }));
    } catch (e) {
      /* best-effort */
    }
  };

  const ensureSession = (emailFirstName) => {
    if (sessions.length > 0 && activeSessionId) return activeSessionId;
    const session = makeSession(emailFirstName);
    const next = [session, ...sessions];
    setSessions(next);
    setActiveSessionId(session.id);
    persist(next, session.id);
    return session.id;
  };

  const createSession = (emailFirstName) => {
    const session = makeSession(emailFirstName);
    const next = [session, ...sessions];
    setSessions(next);
    setActiveSessionId(session.id);
    persist(next, session.id);
    return session.id;
  };

  const selectSession = (id) => {
    setActiveSessionId(id);
    persist(sessions, id);
  };

  const updateSessionMessages = (id, messages) => {
    const firstUserMsg = messages.find((m) => m.role === 'user');
    const next = sessions.map((s) =>
      s.id === id
        ? {
            ...s,
            messages,
            title: firstUserMsg ? firstUserMsg.text.slice(0, 32) : s.title,
            updatedAt: new Date().toISOString(),
          }
        : s
    );
    setSessions(next);
    persist(next, activeSessionId);
  };

  const deleteSession = (id) => {
    const next = sessions.filter((s) => s.id !== id);
    const nextActive = id === activeSessionId ? next[0]?.id ?? null : activeSessionId;
    setSessions(next);
    setActiveSessionId(nextActive);
    persist(next, nextActive);
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  return (
    <ChatContext.Provider
      value={{
        sessions,
        activeSessionId,
        activeSession,
        ensureSession,
        createSession,
        selectSession,
        updateSessionMessages,
        deleteSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatSessions() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatSessions must be used inside <ChatProvider>');
  return ctx;
}