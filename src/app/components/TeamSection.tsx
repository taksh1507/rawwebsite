/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { teamMembers, TeamMember } from '@/data/teamData';
import styles from '../styles/TeamSection.module.css';

type CategoryType = 'all' | 'core' | 'mentors' | 'members';

const TeamSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Handle scroll to member on load if hash is present
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const memberId = hash.substring(1);
        setTimeout(() => {
          const element = document.getElementById(memberId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add highlight effect
            element.classList.add(styles.highlighted);
            setTimeout(() => {
              element.classList.remove(styles.highlighted);
            }, 3000);
          }
        }, 500);
      }
    }
  }, []);

  const categories = [
    { id: 'all', label: 'All Team', count: teamMembers.length },
    { id: 'core', label: 'Core Team', count: teamMembers.filter(m => m.category === 'core').length },
    { id: 'mentors', label: 'Mentors', count: teamMembers.filter(m => m.category === 'mentors').length },
    { id: 'members', label: 'Members', count: teamMembers.filter(m => m.category === 'members').length },
  ];

  // Custom sort function to order members: Faculty -> Core -> Mentors -> Members
  const sortMembers = (members: TeamMember[]) => {
    return [...members].sort((a, b) => {
      // Define role priority (lower number = higher priority)
      const getRolePriority = (member: TeamMember) => {
        if (member.role === 'FACULTY IN-CHARGE') return 0;
        if (member.category === 'core') return 1;
        if (member.category === 'mentors') return 2;
        if (member.category === 'members') return 3;
        return 4;
      };
      
      const priorityA = getRolePriority(a);
      const priorityB = getRolePriority(b);
      
      return priorityA - priorityB;
    });
  };

  const filteredMembers = sortMembers(
    activeCategory === 'all' 
      ? teamMembers 
      : teamMembers.filter(member => member.category === activeCategory)
  );

  const handleCategoryChange = (category: CategoryType) => {
    setIsLoading(true);
    setActiveCategory(category);
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <section className={styles.section}>
      {/* Hero Section with Background Image */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.container}>
            {/* Header - Clean and Focused */}
            <motion.div 
              className={styles.header}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2>
                Meet Our <span className={styles.redAccent}>Team</span>
              </h2>
              <p>
                The brilliant minds behind Team RAW, driving innovation and excellence in robotics
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* White Section with Filter Pills */}
      <div className={styles.filterSection}>
        <motion.div 
          className={styles.filterContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.filterPill} ${
                activeCategory === category.id ? styles.active : ''
              }`}
              onClick={() => handleCategoryChange(category.id as CategoryType)}
            >
              {category.label}
              <span className={styles.pillCount}>{category.count}</span>
            </button>
          ))}
        </motion.div>
      </div>

      {/* Main Content Area */}
      <div className={styles.gridContainer}>
        {/* Result Count */}
        <motion.div 
          className={styles.resultCount}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Showing <span>{filteredMembers.length}</span> team member{filteredMembers.length !== 1 ? 's' : ''}
        </motion.div>

        {/* Team Grid - Loading State */}
        {isLoading ? (
          <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonImage}></div>
                <div className={styles.skeletonContent}>
                  <div className={styles.skeletonName}></div>
                  <div className={styles.skeletonRole}></div>
                  <div className={styles.skeletonDept}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Team Grid - Actual Cards */
          <motion.div 
            className={styles.grid}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredMembers.map((member, index) => (
              <motion.div
                key={member._id}
                id={member._id}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                {/* Category Badge */}
                <div className={styles.categoryBadge}>
                  {member.category.toUpperCase()}
                </div>

                {/* Image Container */}
                <div className={styles.imageContainer}>
                  <Image
                    src={member.imageUrl}
                    alt={`${member.name} - ${member.role}`}
                    width={300}
                    height={300}
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.memberImage}
                    unoptimized
                  />
                </div>

                {/* Card Content */}
                <div className={styles.cardContent}>
                  <h3 className={styles.memberName}>{member.name}</h3>
                  <p className={styles.memberRole}>{member.role}</p>
                  
                  {/* Social Icons */}
                  {(member.email || member.linkedin) && (
                    <div className={styles.socialIconsOverlay}>
                      {member.linkedin && (
                        <motion.a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.socialIconButton}
                          aria-label={`LinkedIn profile of ${member.name}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                        </motion.a>
                      )}
                      {member.email && (
                        <motion.a
                          href={`mailto:${member.email}`}
                          className={styles.socialIconButton}
                          aria-label={`Email ${member.name}`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                            <polyline points="22,6 12,13 2,6"/>
                          </svg>
                        </motion.a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMembers.length === 0 && (
          <motion.div 
            className={styles.emptyState}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.emptyIcon}>👥</div>
            <h3>No team members available</h3>
            <p>There are no team members in this category yet.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
