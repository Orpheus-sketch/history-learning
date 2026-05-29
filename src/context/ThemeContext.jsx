import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEMES = [
  { id: 'ink', name: '水墨山水', icon: '🏔️', desc: '源自《山水情》《牧笛》的墨韵意境' },
  { id: 'heaven', name: '天宫云海', icon: '☁️', desc: '源自《大闹天宫》的瑰丽天宫' },
  { id: 'dunhuang', name: '敦煌神韵', icon: '🦌', desc: '源自《九色鹿》的壁画风韵' },
  { id: 'landscape', name: '青绿山水', icon: '🌿', desc: '源自传统青绿山水画的设色' },
  { id: 'papercut', name: '剪纸红韵', icon: '🏮', desc: '源自剪纸动画的质朴热烈' },
];

const PATTERNS = [
  { id: 'none', name: '无底纹', icon: '◻️', desc: '纯色背景' },
  { id: 'coco', name: '矢车菊纹', icon: '🌼', desc: '《寻梦环游记》万寿菊花瓣纹样' },
  { id: 'cloud', name: '祥云纹', icon: '☁️', desc: '传统祥云瑞气纹样' },
  { id: 'wave', name: '水波纹', icon: '🌊', desc: '古典水波涟漪纹样' },
  { id: 'grid', name: '回字纹', icon: '🔲', desc: '传统回纹几何纹样' },
  { id: 'branch', name: '缠枝纹', icon: '🌿', desc: '缠枝花卉连续纹样' },
  { id: 'onepiece', name: '航海纹', icon: '🏴‍☠️', desc: '《One Piece》航海冒险波纹' },
];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('bg-theme') || 'ink';
  });
  const [pattern, setPattern] = useState(() => {
    return localStorage.getItem('bg-pattern') || 'coco';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('bg-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-pattern', pattern);
    localStorage.setItem('bg-pattern', pattern);
  }, [pattern]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES, pattern, setPattern, patterns: PATTERNS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
