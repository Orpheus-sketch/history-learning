import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeSwitcher.module.css';

export default function ThemeSwitcher() {
  const { theme, setTheme, themes, pattern, setPattern, patterns } = useTheme();
  const [tab, setTab] = useState('theme'); // 'theme' | 'pattern'
  const [open, setOpen] = useState(false);
  const current = themes.find((t) => t.id === theme);
  const currentPattern = patterns.find((p) => p.id === pattern);

  return (
    <div className={styles.wrapper}>
      {open && (
        <div className={styles.backdrop} onClick={() => setOpen(false)} />
      )}
      <div className={styles.container}>
        {open && (
          <div className={styles.panel}>
            <div className={styles.tabRow}>
              <button
                className={`${styles.tabBtn} ${tab === 'theme' ? styles.tabBtnActive : ''}`}
                onClick={() => setTab('theme')}
              >
                背景主题
              </button>
              <button
                className={`${styles.tabBtn} ${tab === 'pattern' ? styles.tabBtnActive : ''}`}
                onClick={() => setTab('pattern')}
              >
                底纹图案
              </button>
            </div>

            {tab === 'theme' && themes.map((t) => (
              <button
                key={t.id}
                className={`${styles.option} ${theme === t.id ? styles.optionActive : ''}`}
                onClick={() => { setTheme(t.id); }}
              >
                <span className={styles.optIcon}>{t.icon}</span>
                <div className={styles.optInfo}>
                  <span className={styles.optName}>{t.name}</span>
                  <span className={styles.optDesc}>{t.desc}</span>
                </div>
                {theme === t.id && <span className={styles.check}>✓</span>}
              </button>
            ))}

            {tab === 'pattern' && patterns.map((p) => (
              <button
                key={p.id}
                className={`${styles.option} ${pattern === p.id ? styles.optionActive : ''}`}
                onClick={() => { setPattern(p.id); }}
              >
                <span className={styles.optIcon}>{p.icon}</span>
                <div className={styles.optInfo}>
                  <span className={styles.optName}>{p.name}</span>
                  <span className={styles.optDesc}>{p.desc}</span>
                </div>
                {pattern === p.id && <span className={styles.check}>✓</span>}
              </button>
            ))}
          </div>
        )}
        <button
          className={styles.trigger}
          onClick={() => setOpen(!open)}
          title="切换背景和底纹"
        >
          <span className={styles.triggerIcon}>{current?.icon || '🎨'}</span>
        </button>
      </div>
    </div>
  );
}
