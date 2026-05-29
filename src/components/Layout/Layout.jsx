import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <>
      <Header />
      <Sidebar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <ThemeSwitcher />
    </>
  );
}
