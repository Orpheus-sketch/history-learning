import { NavLink, useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const navItems = [
  { path: '/', label: '首页', icon: '📖' },
  { path: '/knowledge', label: '知识学习', icon: '📚' },
  { path: '/timeline', label: '时间线', icon: '⏳' },
  { path: '/quiz', label: '习题练习', icon: '✏️' },
  { path: '/progress', label: '学习进度', icon: '📊' },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.logo}>🏛️</span>
        <span className={styles.title}>历史学习</span>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
            end={item.path === '/'}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
