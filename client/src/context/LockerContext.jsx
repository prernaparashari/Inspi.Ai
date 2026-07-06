import React, { createContext, useContext, useState, useEffect } from 'react';

const LockerContext = createContext(null);
const STORAGE_KEY = 'inspiai:locker';

const DEFAULT_COLLECTIONS = [
  { id: 'exam-stress', name: 'Exam Stress', emoji: '📚', quotes: [] },
  { id: 'lonely-nights', name: 'Lonely Nights', emoji: '🌙', quotes: [] },
  { id: 'morning-energy', name: 'Morning Energy', emoji: '☀️', quotes: [] },
];

export function LockerProvider({ children }) {
  const [collections, setCollections] = useState(DEFAULT_COLLECTIONS);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          
          setCollections(parsed);
        } else {
          if (parsed.collections) setCollections(parsed.collections);
          if (parsed.diaryEntries) setDiaryEntries(parsed.diaryEntries);
          if (parsed.todos) setTodos(parsed.todos);
        }
      }
    } catch (e) {
      
    }
  }, []);

  const persist = (nextCollections, nextDiary, nextTodos) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ collections: nextCollections, diaryEntries: nextDiary, todos: nextTodos })
      );
    } catch (e) {
      /* best-effort */
    }
  };

  const createCollection = (name, emoji = '💜') => {
    const id = `${name.trim().toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const next = [...collections, { id, name: name.trim(), emoji, quotes: [] }];
    setCollections(next);
    persist(next, diaryEntries, todos);
    return id;
  };

  const addQuote = (collectionId, text) => {
    const next = collections.map((c) =>
      c.id === collectionId
        ? { ...c, quotes: [{ id: `q-${Date.now()}`, text, savedAt: new Date().toISOString() }, ...c.quotes] }
        : c
    );
    setCollections(next);
    persist(next, diaryEntries, todos);
  };

  const removeQuote = (collectionId, quoteId) => {
    const next = collections.map((c) =>
      c.id === collectionId ? { ...c, quotes: c.quotes.filter((q) => q.id !== quoteId) } : c
    );
    setCollections(next);
    persist(next, diaryEntries, todos);
  };

  const deleteCollection = (collectionId) => {
    const next = collections.filter((c) => c.id !== collectionId);
    setCollections(next);
    persist(next, diaryEntries, todos);
  };

  const addDiaryEntry = (text, aiReply = null) => {
    const next = [
      { id: `d-${Date.now()}`, text, aiReply, writtenAt: new Date().toISOString() },
      ...diaryEntries,
    ];
    setDiaryEntries(next);
    persist(collections, next, todos);
    return next[0].id;
  };

  const removeDiaryEntry = (entryId) => {
    const next = diaryEntries.filter((d) => d.id !== entryId);
    setDiaryEntries(next);
    persist(collections, next, todos);
  };

  
  const addTodo = (text, dateKey = new Date().toISOString().slice(0, 10)) => {
    const next = [{ id: `t-${Date.now()}`, text, done: false, date: dateKey }, ...todos];
    setTodos(next);
    persist(collections, diaryEntries, next);
  };

  const toggleTodo = (todoId) => {
    const next = todos.map((t) => (t.id === todoId ? { ...t, done: !t.done } : t));
    setTodos(next);
    persist(collections, diaryEntries, next);
  };

  const removeTodo = (todoId) => {
    const next = todos.filter((t) => t.id !== todoId);
    setTodos(next);
    persist(collections, diaryEntries, next);
  };

  return (
    <LockerContext.Provider
      value={{
        collections,
        createCollection,
        addQuote,
        removeQuote,
        deleteCollection,
        diaryEntries,
        addDiaryEntry,
        removeDiaryEntry,
        todos,
        addTodo,
        toggleTodo,
        removeTodo,
      }}
    >
      {children}
    </LockerContext.Provider>
  );
}

export function useLocker() {
  const ctx = useContext(LockerContext);
  if (!ctx) throw new Error('useLocker must be used inside <LockerProvider>');
  return ctx;
}