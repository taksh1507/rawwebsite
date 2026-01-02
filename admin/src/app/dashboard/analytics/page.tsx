/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { useState, useEffect } from 'react';
import styles from './analytics.module.css';

interface TeamStats {
  total: number;
  byCategory: { core: number; mentors: number; members: number; alumni: number };
  byDepartment: Record<string, number>;
  trend?: number;
}

interface GalleryStats {
  total: number;
  byCategory: Record<string, number>;
  trend?: number;
}

interface ContactStats {
  total: number;
  byStatus: { new: number; read: number; replied: number };
  trend?: number;
}

export default function Analytics() {
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [galleryStats, setGalleryStats] = useState<GalleryStats | null>(null);
  const [contactStats, setContactStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock analytics with trend data
    setTeamStats({
      total: 24,
      byCategory: { core: 8, mentors: 4, members: 10, alumni: 2 },
      byDepartment: { Mechanical: 8, Electronics: 7, Software: 6, Management: 3 },
      trend: 12.5,
    });
    setGalleryStats({
      total: 156,
      byCategory: { robots: 42, events: 38, workshops: 28, competitions: 24, team: 14, milestones: 10 },
      trend: 8.3,
    });
    setContactStats({
      total: 47,
      byStatus: { new: 12, read: 23, replied: 12 },
      trend: -5.2,
    });
    setLastUpdated(new Date());
    setLoading(false);
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    const now = new Date();
    const diff = now.getTime() - lastUpdated.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const renderTrend = (trend?: number) => {
    if (!trend) return null;
    const isPositive = trend > 0;
    return (
      <span className={`${styles.trend} ${isPositive ? styles.trendUp : styles.trendDown}`}>
        {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
      </span>
    );
  };

  const MetricCard = ({ 
    icon, 
    label, 
    value, 
    color, 
    trend, 
    loading 
  }: { 
    icon: string; 
    label: string; 
    value: number; 
    color: string; 
    trend?: number; 
    loading?: boolean;
  }) => (
    <div className={`${styles.metricCard} ${styles[color]}`} title={label}>
      {loading ? (
        <div className={styles.skeletonCard}>
          <div className={styles.skeletonIcon}></div>
          <div className={styles.skeletonText}></div>
        </div>
      ) : (
        <>
          <div className={styles.metricIcon}>{icon}</div>
          <div className={styles.metricContent}>
            <div className={styles.metricValue}>{value}</div>
            <div className={styles.metricLabel}>{label}</div>
          </div>
          {trend !== undefined && renderTrend(trend)}
        </>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Analytics Dashboard</h1>
          <p className={styles.subtitle}>Platform insights and metrics</p>
        </div>
        <div className={styles.metricsGrid}>
          {[...Array(6)].map((_, i) => (
            <MetricCard key={i} icon="" label="" value={0} color="gray" loading={true} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Analytics Dashboard</h1>
          <p className={styles.subtitle}>Platform insights and performance metrics</p>
        </div>
        {lastUpdated && (
          <div className={styles.lastUpdated}>
            <span className={styles.updateIcon}>🕐</span>
            Last updated: {formatLastUpdated()}
          </div>
        )}
      </div>

      {/* Key Metrics Overview */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>📊</span>
          Key Metrics
        </h2>
        <div className={styles.metricsGrid}>
          <MetricCard 
            icon="👥" 
            label="Total Members" 
            value={teamStats?.total || 0} 
            color="red" 
            trend={teamStats?.trend}
          />
          <MetricCard 
            icon="💬" 
            label="Contact Messages" 
            value={contactStats?.total || 0} 
            color="blue" 
            trend={contactStats?.trend}
          />
          <MetricCard 
            icon="🖼️" 
            label="Gallery Images" 
            value={galleryStats?.total || 0} 
            color="green" 
            trend={galleryStats?.trend}
          />
          <MetricCard 
            icon="📮" 
            label="Unread Messages" 
            value={contactStats?.byStatus.new || 0} 
            color="orange"
          />
          <MetricCard 
            icon="✅" 
            label="Replied Messages" 
            value={contactStats?.byStatus.replied || 0} 
            color="green"
          />
          <MetricCard 
            icon="👨‍🏫" 
            label="Mentors" 
            value={teamStats?.byCategory.mentors || 0} 
            color="purple"
          />
        </div>
      </div>

      <div className={styles.divider}></div>

      {/* Team Statistics */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>👥</span>
          Team Statistics
        </h2>
        
        {teamStats && teamStats.total > 0 ? (
          <>
            <div className={styles.categoryGrid}>
              <div className={styles.categoryCard}>
                <div className={styles.categoryIcon}>⭐</div>
                <div className={styles.categoryValue}>{teamStats.byCategory.core}</div>
                <div className={styles.categoryLabel}>Core Team</div>
              </div>
              <div className={styles.categoryCard}>
                <div className={styles.categoryIcon}>👨‍🏫</div>
                <div className={styles.categoryValue}>{teamStats.byCategory.mentors}</div>
                <div className={styles.categoryLabel}>Mentors</div>
              </div>
              <div className={styles.categoryCard}>
                <div className={styles.categoryIcon}>👨‍💻</div>
                <div className={styles.categoryValue}>{teamStats.byCategory.members}</div>
                <div className={styles.categoryLabel}>Members</div>
              </div>
              <div className={styles.categoryCard}>
                <div className={styles.categoryIcon}>🎓</div>
                <div className={styles.categoryValue}>{teamStats.byCategory.alumni}</div>
                <div className={styles.categoryLabel}>Alumni</div>
              </div>
            </div>

            <div className={styles.chartContainer}>
              <h3 className={styles.chartTitle}>Members by Department</h3>
              <div className={styles.barChart}>
                {Object.entries(teamStats.byDepartment).map(([dept, count]) => {
                  const maxCount = Math.max(...Object.values(teamStats.byDepartment));
                  const percentage = (count / maxCount) * 100;
                  return (
                    <div key={dept} className={styles.barItem}>
                      <div className={styles.barLabel}>{dept}</div>
                      <div className={styles.barWrapper}>
                        <div className={styles.bar} style={{ width: `${percentage}%` }}>
                          <span className={styles.barValue}>{count}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>👥</div>
            <h3 className={styles.emptyTitle}>No team data available</h3>
            <p className={styles.emptyText}>Team member statistics will appear here once data is available</p>
          </div>
        )}
      </div>

      <div className={styles.divider}></div>

      {/* Gallery Statistics */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🖼️</span>
          Gallery Statistics
        </h2>
        
        {galleryStats && galleryStats.total > 0 ? (
          <div className={styles.categoryGrid}>
            {Object.entries(galleryStats.byCategory).map(([category, count]) => (
              <div key={category} className={styles.categoryCard}>
                <div className={styles.categoryValue}>{count}</div>
                <div className={styles.categoryLabel}>{category.charAt(0).toUpperCase() + category.slice(1)}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📷</div>
            <h3 className={styles.emptyTitle}>No gallery data available</h3>
            <p className={styles.emptyText}>Gallery statistics will be displayed here once images are uploaded</p>
          </div>
        )}
      </div>

      <div className={styles.divider}></div>

      {/* Contact Messages Breakdown */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>💬</span>
          Contact Messages Breakdown
        </h2>
        
        {contactStats && contactStats.total > 0 ? (
          <div className={styles.statusGrid}>
            <div className={`${styles.statusCard} ${styles.statusNew}`}>
              <div className={styles.statusIcon}>📮</div>
              <div className={styles.statusValue}>{contactStats.byStatus.new}</div>
              <div className={styles.statusLabel}>New Messages</div>
              <div className={styles.statusBar}>
                <div 
                  className={styles.statusFill} 
                  style={{ width: `${(contactStats.byStatus.new / contactStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className={`${styles.statusCard} ${styles.statusRead}`}>
              <div className={styles.statusIcon}>📧</div>
              <div className={styles.statusValue}>{contactStats.byStatus.read}</div>
              <div className={styles.statusLabel}>Read Messages</div>
              <div className={styles.statusBar}>
                <div 
                  className={styles.statusFill} 
                  style={{ width: `${(contactStats.byStatus.read / contactStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className={`${styles.statusCard} ${styles.statusReplied}`}>
              <div className={styles.statusIcon}>✅</div>
              <div className={styles.statusValue}>{contactStats.byStatus.replied}</div>
              <div className={styles.statusLabel}>Replied</div>
              <div className={styles.statusBar}>
                <div 
                  className={styles.statusFill} 
                  style={{ width: `${(contactStats.byStatus.replied / contactStats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h3 className={styles.emptyTitle}>No contact messages yet</h3>
            <p className={styles.emptyText}>Message statistics will be shown here when users start contacting you</p>
          </div>
        )}
      </div>

      {/* System Health Summary */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>🎯</span>
          System Health
        </h2>
        <div className={styles.healthGrid}>
          <div className={styles.healthCard}>
            <div className={styles.healthStatus}>
              <span className={`${styles.healthDot} ${styles.healthGood}`}></span>
              <span className={styles.healthLabel}>Team Management</span>
            </div>
            <p className={styles.healthText}>
              {teamStats?.total || 0} members across {Object.keys(teamStats?.byDepartment || {}).length} departments
            </p>
          </div>
          <div className={styles.healthCard}>
            <div className={styles.healthStatus}>
              <span className={`${styles.healthDot} ${styles.healthGood}`}></span>
              <span className={styles.healthLabel}>Content Library</span>
            </div>
            <p className={styles.healthText}>
              {galleryStats?.total || 0} images in gallery
            </p>
          </div>
          <div className={styles.healthCard}>
            <div className={styles.healthStatus}>
              <span className={`${styles.healthDot} ${contactStats && contactStats.byStatus.new > 5 ? styles.healthWarning : styles.healthGood}`}></span>
              <span className={styles.healthLabel}>Communication</span>
            </div>
            <p className={styles.healthText}>
              {contactStats?.byStatus.new || 0} unread message{contactStats && contactStats.byStatus.new !== 1 ? 's' : ''} 
              {contactStats && contactStats.byStatus.new > 5 ? ' - needs attention' : ''}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
