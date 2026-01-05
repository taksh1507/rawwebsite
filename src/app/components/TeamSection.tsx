/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { teamMembers, TeamMember } from '@/data/teamData';
import styles from '../styles/TeamSection.module.css';

type CategoryType = 'all' | 'core' | 'mentors' | 'members';

const TeamSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [isLoading, setIsLoading] = useState(false);

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
