/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import styles from './layout.module.css';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.main}>
          <Header />
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
