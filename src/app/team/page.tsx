/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import React from 'react';
import Navbar from '../components/Navbar';
import TeamSection from '../components/TeamSection';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Our Team | Team RAW',
  description: 'Meet the talented individuals behind Team RAW - our core team, mentors, members, and alumni who drive innovation in robotics.',
};

const TeamPage = () => {
  return (
    <main style={{
      background: 'linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%)',
      position: 'relative',
      minHeight: '100vh'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: '-50%',
        width: '1000px',
        height: '1000px',
        background: 'radial-gradient(circle, rgba(225, 6, 0, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar />
        <TeamSection />
        <Footer />
      </div>
    </main>
  );
};

export default TeamPage;
