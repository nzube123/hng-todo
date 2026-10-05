import { useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  try {
    const saved = window.localStorage.getItem('daymark-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // Continue with the operating system preference when storage is unavailable.
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#111a16' : '#f5f7f4');
    try {
      window.localStorage.setItem('daymark-theme', theme);
    } catch {
      // The theme still works for this session when storage is unavailable.
    }
  }, [theme]);

  return { theme, toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light') };
}
