/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import styles from './dashboard.module.css';

export default function Dashboard() {
  const stats = [
    { label: 'Total Members', value: '24', icon: '👥', color: '#d41c3d' },
    { label: 'Active Teams', value: '4', icon: '🎯', color: '#2196F3' },
    { label: 'Departments', value: '6', icon: '🏢', color: '#4CAF50' },
    { label: 'This Month', value: '+8', icon: '📈', color: '#FF9800' },
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your team overview.</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>{stat.label}</p>
              <h3 className={styles.statValue}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>Recent Activity</h2>
          <div className={styles.activityList}>
            <div className={styles.activityItem}>
              <span className={styles.dot}></span>
              <div>
                <p className={styles.activityTitle}>New member added</p>
                <p className={styles.activityTime}>2 hours ago</p>
              </div>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.dot}></span>
              <div>
                <p className={styles.activityTitle}>Team updated</p>
                <p className={styles.activityTime}>5 hours ago</p>
              </div>
            </div>
            <div className={styles.activityItem}>
              <span className={styles.dot}></span>
              <div>
                <p className={styles.activityTitle}>Gallery updated</p>
                <p className={styles.activityTime}>1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Quick Actions</h2>
          <div className={styles.actionButtons}>
            <button className={styles.actionBtn}>➕ Add Member</button>
            <button className={styles.actionBtn}>📸 Upload Photo</button>
            <button className={styles.actionBtn}>📊 View Report</button>
            <button className={styles.actionBtn}>⚙️ Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
