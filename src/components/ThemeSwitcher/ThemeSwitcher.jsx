import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './ThemeSwitcher.module.css';

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const current = themes.find((t) => t.id === theme);

  return (
    <div className={styles.wrapper}>
      {open && (
        <div className={styles.backdrop} onClick={() => setOpen(false)} />
      )}
      <div className={styles.container}>
        {open && (
          <div className={styles.panel}>
            <div className={styles.panelTitle}>选择背景主题</div>
            {themes.map((t) => (
              <button
                key={t.id}
                className={`${styles.option} ${theme === t.id ? styles.optionActive : ''}`}
                onClick={() => { setTheme(t.id); setOpen(false); }}
              >
                <span className={styles.optIcon}>{t.icon}</span>
                <div className={styles.optInfo}>
                  <span className={styles.optName}>{t.name}</span>
                  <span className={styles.optDesc}>{t.desc}</span>
                </div>
                {theme === t.id && <span className={styles.check}>✓</span>}
              </button>
            ))}
          </div>
        )}
        <button
          className={styles.trigger}
          onClick={() => setOpen(!open)}
          title="切换背景主题"
        >
          <span className={styles.triggerIcon}>{current?.icon || '🎨'}</span>
        </button>
      </div>
    </div>
  );
}
