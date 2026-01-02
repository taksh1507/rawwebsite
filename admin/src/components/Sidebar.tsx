/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { label: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
    { label: 'Contact', href: '/dashboard/contact', icon: '💬' },
    { label: 'Updates', href: '/dashboard/updates', icon: '📢' },
    { label: 'Profile', href: '/dashboard/profile', icon: '👤' },
    { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span>🚀</span>
        <h2>Team Raw</h2>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <p>© 2025 Team Raw</p>
      </div>
    </aside>
  );
}
