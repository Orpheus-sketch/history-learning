import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEMES = [
  { id: 'ink', name: '水墨山水', icon: '🏔️', desc: '源自《山水情》《牧笛》的墨韵意境' },
  { id: 'heaven', name: '天宫云海', icon: '☁️', desc: '源自《大闹天宫》的瑰丽天宫' },
  { id: 'dunhuang', name: '敦煌神韵', icon: '🦌', desc: '源自《九色鹿》的壁画风韵' },
  { id: 'landscape', name: '青绿山水', icon: '🌿', desc: '源自传统青绿山水画的设色' },
  { id: 'papercut', name: '剪纸红韵', icon: '🏮', desc: '源自剪纸动画的质朴热烈' },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bg-theme') || 'ink';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bg-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
