import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';
import styles from './Header.module.css';

const navItems = [
  { path: '/home', label: '首页', icon: '📖' },
  { path: '/knowledge', label: '知识学习', icon: '📚' },
  { path: '/timeline', label: '时间线', icon: '⏳' },
  { path: '/quiz', label: '习题练习', icon: '✏️' },
  { path: '/progress', label: '学习进度', icon: '📊' },
];

export default function Header() {
  const { activeAccount, accounts, switchAccount, logout } = useAccount();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSwitch = (id) => {
    switchAccount(id);
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/account');
  };

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
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.spacer} />

      {activeAccount && (
        <div className={styles.account}>
          <button
            className={styles.avatarBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            title={activeAccount.nickname}
          >
            <span className={styles.avatarEmoji}>{activeAccount.avatar}</span>
            <span className={styles.avatarName}>{activeAccount.nickname}</span>
          </button>

          {menuOpen && (
            <>
              <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />
              <div className={styles.menu}>
                <div className={styles.menuHeader}>
                  <span className={styles.menuAvatar}>{activeAccount.avatar}</span>
                  <div>
                    <div className={styles.menuNickname}>{activeAccount.nickname}</div>
                    <div className={styles.menuName}>{activeAccount.name}</div>
                  </div>
                </div>

                <div className={styles.menuSection}>
                  <div className={styles.menuLabel}>切換賬戶</div>
                  {accounts.filter((a) => a.id !== activeAccount.id).map((a) => (
                    <button
                      key={a.id}
                      className={styles.menuItem}
                      onClick={() => handleSwitch(a.id)}
                    >
                      <span>{a.avatar}</span>
                      <span>{a.nickname}</span>
                    </button>
                  ))}
                  <button
                    className={styles.menuItem}
                    onClick={() => { setMenuOpen(false); navigate('/account'); }}
                  >
                    <span>+</span>
                    <span>管理賬戶</span>
                  </button>
                </div>

                <div className={styles.menuDivider} />

                <button
                  className={styles.menuItem}
                  onClick={() => { setMenuOpen(false); navigate('/profile'); }}
                >
                  <span>⚙️</span>
                  <span>個人設置</span>
                </button>

                <button className={styles.menuItem} onClick={handleLogout}>
                  <span>🚪</span>
                  <span>退出登錄</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
