import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(undefined);

const STORAGE_KEY = 'inspi_theme';
const THEMES = { LAVENDER: 'lavender', BLUE: 'blue' };

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === THEMES.LAVENDER || stored === THEMES.BLUE) return stored;

  
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? THEMES.BLUE : THEMES.LAVENDER;
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === THEMES.LAVENDER ? THEMES.BLUE : THEMES.LAVENDER));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}