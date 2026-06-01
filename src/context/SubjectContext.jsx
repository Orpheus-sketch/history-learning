import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const SubjectContext = createContext();

export const SUBJECTS = [
  {
    id: 'history',
    name: '历史',
    icon: '🏛️',
    desc: '以史为鉴，知兴替明得失',
    color: '#b45309',
    gradient: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
  },
  {
    id: 'geography',
    name: '地理',
    icon: '🌍',
    desc: '认识世界，探索地球奥秘',
    color: '#0d9488',
    gradient: 'linear-gradient(135deg, #0a1628, #0f3b3a, #0b5e57)',
  },
  {
    id: 'biology',
    name: '生物',
    icon: '🧬',
    desc: '探索生命，理解自然法则',
    color: '#16a34a',
    gradient: 'linear-gradient(135deg, #0a1a0f, #143a21, #1a5c32)',
  },
];

function loadSubject() {
  try {
    const s = localStorage.getItem('hl-subject');
    if (s && SUBJECTS.find((sub) => sub.id === s)) return s;
  } catch { /* ignore */ }
  return 'history';
}

function saveSubject(id) {
  localStorage.setItem('hl-subject', id);
}

export function SubjectProvider({ children }) {
  const [subject, setSubjectState] = useState(loadSubject);

  const setSubject = (id) => {
    setSubjectState(id);
    saveSubject(id);
  };

  // Sync with other tabs
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'hl-subject' && e.newValue) {
        setSubjectState(e.newValue);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const currentSubject = useMemo(
    () => SUBJECTS.find((s) => s.id === subject) || SUBJECTS[0],
    [subject]
  );

  return (
    <SubjectContext.Provider value={{ subject, setSubject, currentSubject, subjects: SUBJECTS }}>
      {children}
    </SubjectContext.Provider>
  );
}

export function useSubject() {
  return useContext(SubjectContext);
}
