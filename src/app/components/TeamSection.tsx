/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { teamMembers, TeamMember, domains, Domain } from '@/data/teamData';
import { Zap, Briefcase, Calendar, Users, Cpu, Code, Cog, Linkedin, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../styles/TeamSection.module.css';

const TeamSection: React.FC = () => {
  const [activeDomain, setActiveDomain] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const domainTabsRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Read domain from URL query parameter on mount
  useEffect(() => {
    const domainParam = searchParams.get('domain');
    if (domainParam && domains.some(d => d.id === domainParam)) {
      setActiveDomain(domainParam);
    }
  }, [searchParams]);

  // Member Card Component
  const MemberCard: React.FC<{ member: TeamMember; index: number; isCore?: boolean }> = ({ member, index, isCore }) => (
    <motion.div
      key={member._id}
      id={member._id}
      className={isCore ? `${styles.memberCard} ${styles.coreMemberCard}` : styles.memberCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(225, 6, 0, 0.2)' }}
    >
      <div className={styles.memberImageWrapper}>
        <Image
          src={member.imageUrl}
          alt={member.name}
          width={300}
          height={300}
          className={styles.memberImage}
          unoptimized
        />
      </div>

      <div className={styles.memberInfo}>
        <h4 className={styles.memberName}>{member.name}</h4>
        <p className={styles.memberRole}>{member.role}</p>
        <div className={styles.memberCategory}>
          {member.category === 'core' && <span className={styles.coreBadge}>Core</span>}
          {member.category === 'mentors' && <span className={styles.mentorBadge}>Mentor</span>}
          {member.category === 'members' && <span className={styles.memberBadge}>Member</span>}
        </div>

        {/* Responsibilities List */}
        {member.responsibilities && member.responsibilities.length > 0 && (
          <div className={styles.memberResponsibilities}>
            {member.responsibilities.map((resp, idx) => (
              <div key={idx} className={styles.responsibilityItem}>
                <span className={styles.responsibilityBullet}>•</span>
                <span className={styles.responsibilityText}>{resp}</span>
              </div>
            ))}
          </div>
        )}
        
        {/* Social Icons - Bottom Right Corner */}
        <div className={styles.socialIconsOverlay}>
          {member.linkedin && (
            <a 
              href={member.linkedin}
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialIconButton}
              title="LinkedIn"
            >
              <Linkedin size={18} />
            </a>
          )}
          {member.email && (
            <a 
              href={`mailto:${member.email}`}
              className={styles.socialIconButton}
              title="Email"
            >
              <Mail size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className={styles.memberCardFooter}>
        <div className={styles.memberDomainsBadges}>
          {getMemberDomains(member.name).map((domainId) => {
            const domain = domains.find(d => d.id === domainId);
            const abbreviation = domainId === 'rnd' ? 'R&D' : domain?.name.split(' ')[0].toUpperCase() || 'GENERAL';
            return (
              <span key={domainId} className={styles.memberCardFooterBadge}>
                {abbreviation}
              </span>
            );
          })}
        </div>
        <div className={styles.memberCardFooterSpacer} />
        <div className={styles.memberCardFooterIcon} title="Team Member">
          <Users size={16} />
        </div>
      </div>
    </motion.div>
  );

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

  // Valid member names for each domain - allows members to be in multiple domains
  const validDomainMembers: { [key: string]: string[] } = {
    electronics: ['Siddhant Monde', 'Parth Sutar', 'Riyan Gonsalves', 'Gunjan Patil', 'Pal Rajak', 'Sarthak Chaurasiya', 'Jay Lohar', 'Aryan Wasnik', 'Nityant Tiwari', 'Siddha Shete', 'Paarth Pradhan', 'Saish Loke'],
    software: ['Nandini Salunkhe', 'Dikshi Adani', 'Samruddhi Kharul', 'Sakshi Virani', 'Swanand Deshpande', 'Jash Mewada', 'Riyan Gonsalves', 'Jay Lohar', 'Nityant Tiwari', 'Taksh Gandhi'],
    mechanical: ['Dittino Thomas', 'Siddhant Monde', 'Vansh Singh', 'Jhoshua Coutinho', 'Jwen Lobo', 'Parth Sutar', 'Sarthak Chaurasiya', 'Siddha Shete', 'Nityant Tiwari', 'Swanand Deshpande', 'Pal Rajak', 'Shail Raut'],
    rnd: ['Dittino Thomas', 'Siddhant Monde', 'Shail Raut', 'Jhoshua Coutinho', 'Vansh Singh', 'Parth Sutar', 'Swanand Deshpande', 'Jash Mewada', 'Siddha Shete', 'Paarth Pradhan'],
    event: ['Nandini Salunkhe', 'Shail Raut', 'Pal Rajak', 'Sarthak Chaurasiya', 'Riyan Gonsalves', 'Jash Mewada', 'Jay Lohar', 'Gunjan Patil'],
    publicity: ['Dittino Thomas', 'Taksh Gandhi', 'Siddhant Monde', 'Aryan Wasnik', 'Sakshi Virani', 'Parth Sutar', 'Jhoshua Coutinho', 'Nityant Tiwari', 'Swanand Deshpande'],
    documentation: ['Dikshi Adani', 'Samruddhi Kharul', 'Sakshi Virani']
  };

  // Get icon component for domain
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Zap, Briefcase, Calendar, Users, Cpu, Code, Cog
    };
    return iconMap[iconName];
  };

  // Get current domain
  const currentDomain = domains.find(d => d.id === activeDomain);

  // Helper function to get all domains for a member
  const getMemberDomains = (memberName: string): string[] => {
    const memberDomains: string[] = [];
    Object.entries(validDomainMembers).forEach(([domainId, members]) => {
      if (members.includes(memberName)) {
        memberDomains.push(domainId);
      }
    });
    return memberDomains; // Return all domains
  };
  
  // Get members - either for specific domain or all members
  let domainMembers = teamMembers;
  
  // For specific domain, filter using whitelist to allow members in multiple domains
  if (activeDomain !== 'all' && validDomainMembers[activeDomain]) {
    domainMembers = teamMembers.filter(m => validDomainMembers[activeDomain].includes(m.name));
  }

  // Sort members: core first, then mentors, then members
  const sortedMembers = [...domainMembers].sort((a, b) => {
    const categoryOrder = { core: 0, mentors: 1, members: 2 };
    return (categoryOrder[a.category as keyof typeof categoryOrder] || 99) - 
           (categoryOrder[b.category as keyof typeof categoryOrder] || 99);
  });

  // Group members by category
  const coreMembers = sortedMembers.filter(m => m.category === 'core');
  const mentorMembers = sortedMembers.filter(m => m.category === 'mentors');
  const regularMembers = sortedMembers.filter(m => m.category === 'members');

  // Use smaller grid for domains with few members (3 or fewer)
  const isSmallMemberCount = activeDomain !== 'all' && sortedMembers.length <= 3;

  const handleDomainChange = (domainId: string) => {
    setIsLoading(true);
    setActiveDomain(domainId);
    setTimeout(() => setIsLoading(false), 300);
  };

  // Check scroll position
  const checkScroll = () => {
    if (domainTabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = domainTabsRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll left
  const scrollLeft = () => {
    if (domainTabsRef.current) {
      domainTabsRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      setTimeout(checkScroll, 100);
    }
  };

  // Scroll right
  const scrollRight = () => {
    if (domainTabsRef.current) {
      domainTabsRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      setTimeout(checkScroll, 100);
    }
  };

  // Initialize scroll check
  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    if (domainTabsRef.current) {
      domainTabsRef.current.addEventListener('scroll', checkScroll);
    }
    return () => {
      window.removeEventListener('resize', checkScroll);
      if (domainTabsRef.current) {
        domainTabsRef.current.removeEventListener('scroll', checkScroll);
      }
    };
  }, []);

  return (
    <section className={styles.section}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.container}>
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
                The brilliant minds behind Team RAW, organized by domains and expertise
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Domain Tabs/Cards with Scroll Arrows */}
      <div className={styles.container}>
        <div className={styles.domainTabsWrapper}>
          {/* Left Arrow */}
          {canScrollLeft && (
            <motion.button
              className={styles.scrollArrow + ' ' + styles.scrollArrowLeft}
              onClick={scrollLeft}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} />
            </motion.button>
          )}

          {/* Domain Tabs */}
          <motion.div 
            ref={domainTabsRef}
            className={styles.domainTabs}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* All Members Button */}
            <motion.button
              className={`${styles.domainTab} ${activeDomain === 'all' ? styles.active : ''}`}
              onClick={() => handleDomainChange('all')}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.domainTabIcon}>
                <Users size={20} strokeWidth={2.5} />
              </div>
              <div className={styles.domainTabContent}>
                <div className={styles.domainTabName}>All Members</div>
                <div className={styles.domainTabCount}>{teamMembers.length} total</div>
              </div>
            </motion.button>

            {/* Mentors Button */}
            <motion.button
              className={`${styles.domainTab} ${activeDomain === 'mentors' ? styles.active : ''}`}
              onClick={() => handleDomainChange('mentors')}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.domainTabIcon}>
                <Briefcase size={20} strokeWidth={2.5} />
              </div>
              <div className={styles.domainTabContent}>
                <div className={styles.domainTabName}>Mentors</div>
                <div className={styles.domainTabCount}>{teamMembers.filter(m => m.category === 'mentors').length} mentors</div>
              </div>
            </motion.button>

            {/* Domain Tabs */}
            {domains.map((domain, index) => {
              const IconComponent = getIconComponent(domain.icon);
              const memberCount = validDomainMembers[domain.id]?.length || 0;
              
              return (
                <motion.button
                  key={domain.id}
                  className={`${styles.domainTab} ${activeDomain === domain.id ? styles.active : ''}`}
                  onClick={() => handleDomainChange(domain.id)}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.domainTabIcon}>
                    {IconComponent && <IconComponent size={20} strokeWidth={2.5} />}
                  </div>
                  <div className={styles.domainTabContent}>
                    <div className={styles.domainTabName}>{domain.name}</div>
                    <div className={styles.domainTabCount}>{memberCount} members</div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Right Arrow */}
          {canScrollRight && (
            <motion.button
              className={styles.scrollArrow + ' ' + styles.scrollArrowRight}
              onClick={scrollRight}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Scroll right"
            >
              <ChevronRight size={24} />
            </motion.button>
          )}
        </div>
      </div>

      {/* Domain Info & Members Section */}
      <motion.div
        key={activeDomain}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={styles.container}
      >
        {activeDomain === 'all' ? (
          <>
            {/* All Members View with Category Sections */}
            
            {/* Core Members Section */}
            {coreMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className={styles.sectionTitle}>Core Members ({coreMembers.length})</h3>
                <motion.div
                  className={styles.membersGrid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {coreMembers.map((member, index) => (
                    <MemberCard key={member._id} member={member} index={index} />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Mentors Section */}
            {mentorMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h3 className={styles.sectionTitle}>Mentors ({mentorMembers.length})</h3>
                <motion.div
                  className={styles.membersGrid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {mentorMembers.map((member, index) => (
                    <MemberCard key={member._id} member={member} index={index} />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Regular Members Section */}
            {regularMembers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h3 className={styles.sectionTitle}>Team Members ({regularMembers.length})</h3>
                <motion.div
                  className={styles.membersGrid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  {regularMembers.map((member, index) => (
                    <MemberCard key={member._id} member={member} index={index} />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </>
        ) : activeDomain === 'mentors' ? (
          <>
            {/* Mentors View */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className={styles.mentorsTitle}>Meet Our <span className={styles.redAccent}>Mentors</span></h2>
              <p className={styles.mentorsDescription}>Experienced guides shaping the future of Team RAW</p>
              
              <motion.div
                className={styles.membersGrid}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {mentorMembers.length > 0 ? (
                  mentorMembers.map((member, index) => (
                    <MemberCard key={member._id} member={member} index={index} />
                  ))
                ) : (
                  <motion.div 
                    className={styles.emptyState}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className={styles.emptyIcon}>👨‍🏫</div>
                    <h3>No mentors available</h3>
                    <p>Check back soon for mentor information.</p>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </>
        ) : currentDomain ? (
          <>
            {/* Domain Info Card - Left Content + Right Image */}
            <motion.div 
              className={styles.domainInfoCard}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {/* Left Side - Domain Info */}
              <div className={styles.domainInfoContent}>
                <h3 className={styles.domainTitle}>{currentDomain.name}</h3>
                
                {/* Domain Head */}
                <div className={styles.domainHeadSection}>
                  <div className={styles.headLabel}>Domain Head</div>
                  <div className={styles.headName}>{currentDomain.head}</div>
                  {(() => {
                    const headMember = teamMembers.find(m => m._id === currentDomain.headId);
                    if (headMember) {
                      return (
                        <>
                          <div className={styles.headPosition}>{headMember.role}</div>
                          <div className={styles.headSocialIcons}>
                            {headMember.linkedin && (
                              <a 
                                href={headMember.linkedin}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={styles.headSocialIcon}
                                title="LinkedIn"
                              >
                                <Linkedin size={16} />
                              </a>
                            )}
                            {headMember.email && (
                              <a 
                                href={`mailto:${headMember.email}`}
                                className={styles.headSocialIcon}
                                title="Email"
                              >
                                <Mail size={16} />
                              </a>
                            )}
                          </div>
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* Domain Objective */}
                <div className={styles.domainObjective}>
                  <div className={styles.objectiveLabel}>Team Objective</div>
                  <ul className={styles.objectiveList}>
                    {currentDomain.objective.split('•').map((point, index) => {
                      const trimmedPoint = point.trim();
                      if (trimmedPoint) {
                        return (
                          <li key={index} className={styles.objectivePoint}>
                            {trimmedPoint}
                          </li>
                        );
                      }
                      return null;
                    })}
                  </ul>
                </div>
              </div>

              {/* Right Side - Domain Head Image */}
              {(() => {
                const headMember = teamMembers.find(m => m._id === currentDomain.headId);
                if (headMember) {
                  return (
                    <div className={styles.domainHeadImageContainer}>
                      <Image
                        src={headMember.imageUrl}
                        alt={currentDomain.head}
                        width={500}
                        height={500}
                        className={styles.domainHeadImage}
                        unoptimized
                      />
                    </div>
                  );
                }
                return null;
              })()}
            </motion.div>

            {/* Members Grid - Organized by Category */}
            {isLoading ? (
              <div className={styles.grid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={styles.skeletonCard}>
                    <div className={styles.skeletonImage}></div>
                    <div className={styles.skeletonContent}>
                      <div className={styles.skeletonName}></div>
                      <div className={styles.skeletonRole}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* All Members Grid - Core First, Then Executive */}
                <motion.div
                  className={`${styles.membersGrid} ${isSmallMemberCount ? styles.membersGridSmall : ''}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  {/* Core Members */}
                  {sortedMembers
                    .filter(member => member.category === 'core' && member._id !== currentDomain?.headId)
                    .map((member, index) => (
                      <MemberCard 
                        key={member._id} 
                        member={member} 
                        index={index}
                        isCore={true}
                      />
                    ))}
                  
                  {/* Executive Members */}
                  {sortedMembers
                    .filter(member => member.category === 'members' && member._id !== currentDomain?.headId)
                    .map((member, index) => (
                      <MemberCard 
                        key={member._id} 
                        member={member} 
                        index={index}
                        isCore={false}
                      />
                    ))}
                </motion.div>
              </>
            )}

            {/* Empty State */}
            {!isLoading && sortedMembers.length === 0 && (
              <motion.div 
                className={styles.emptyState}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className={styles.emptyIcon}>👥</div>
                <h3>No team members yet</h3>
                <p>This domain doesn't have members assigned yet.</p>
              </motion.div>
            )}
          </>
        ) : null}
      </motion.div>
    </section>
  );
};

export default TeamSection;
