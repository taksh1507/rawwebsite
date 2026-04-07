/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import React, { Suspense } from 'react';
import Navbar from '../components/Navbar';
import TeamSection from '../components/TeamSection';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Our Team | Team RAW',
  description: 'Meet the talented individuals behind Team RAW - our core team, mentors, members, and alumni who drive innovation in robotics.',
};

const TeamSectionLoading = () => (
  <div style={{ minHeight: '800px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <p>Loading team members...</p>
  </div>
);

const TeamPage = () => {
  return (
    <main>
      <Navbar />
      <Suspense fallback={<TeamSectionLoading />}>
        <TeamSection />
      </Suspense>
      <Footer />
    </main>
  );
};

export default TeamPage;
