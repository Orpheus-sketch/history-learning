import Header from './Header';
import Sidebar from './Sidebar';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Sidebar />
      <main className={styles.main}>
        {children}
      </main>
      <ThemeSwitcher />
    </>
  );
}
