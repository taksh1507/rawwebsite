/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { LucideIcon } from 'lucide-react';

interface AnimatedStatProps {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  description: string;
  delay?: number;
  ariaLabel?: string;
}

export default function AnimatedStat({ 
  icon: Icon, 
  value, 
  suffix, 
  label, 
  description,
  delay = 0,
  ariaLabel
}: AnimatedStatProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { count, start } = useCountUp(value, 2000, suffix);

  useEffect(() => {
    if (isInView) {
      setTimeout(() => start(), delay);
    }
  }, [isInView, start, delay]);

  return (
    <motion.div
      ref={ref}
      style={{
        textAlign: 'center',
        padding: '2.5rem 2rem',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)',
        borderRadius: '14px',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#E5E7EB',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(10, 26, 58, 0.08)',
        transition: 'all 0.3s ease',
      }}
      whileHover={{
        y: -3,
        borderColor: '#E10600',
        boxShadow: '0 8px 25px rgba(225, 6, 0, 0.2), 0 0 15px rgba(225, 6, 0, 0.15)',
      }}
    >
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          paddingTop: '0.5rem',
        }}
        aria-label={ariaLabel || label}
      >
        <Icon 
          size={44}
          strokeWidth={2}
          style={{
            color: '#E10600',
            filter: 'drop-shadow(0 2px 8px rgba(225, 6, 0, 0.3))',
          }}
        />
      </div>
      
      <h3 style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '2.5rem',
        fontWeight: '900',
        margin: '0 0 0.5rem 0',
        color: '#E10600',
        minHeight: '3rem',
      }}>
        {count}
      </h3>
      
      <p style={{
        fontSize: '1.05rem',
        margin: '0 0 0.5rem 0',
        color: '#0A1A3A',
        fontWeight: '600',
        letterSpacing: '0.3px',
      }}>
        {label}
      </p>
      
      <p style={{
        fontSize: '0.875rem',
        margin: 0,
        color: '#6B7280',
        fontWeight: '400',
        lineHeight: '1.5',
      }}>
        {description}
      </p>
    </motion.div>
  );
}
