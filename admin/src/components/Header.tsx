/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { useAuth } from '@/context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { admin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  // Get initials from email
  const getInitials = () => {
    if (!admin?.email) return 'A';
    return admin.email.charAt(0).toUpperCase();
  };

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1>Admin Dashboard</h1>
      </div>
      <div className={styles.right}>
        <div className={styles.userInfo}>
          <span className={styles.userName}>
            {admin?.name || admin?.email || 'Admin'}
          </span>
          <span className={styles.avatar}>{getInitials()}</span>
        </div>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          🚪 Logout
        </button>
      </div>
    </header>
  );
}
