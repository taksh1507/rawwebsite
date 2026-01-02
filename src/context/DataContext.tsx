/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import teamData from '@/data/teamData';
import galleryData from '@/data/galleryData';
import robotsData from '@/data/robotsData';

// Image variants from Cloudinary (new format)
export interface ImageVariants {
  thumb: string;
  card: string;
  detail: string;
  original: string;
}

interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string; // Legacy format (deprecated)
  images?: ImageVariants; // New format (preferred)
  category: string;
  uploadedBy?: string;
  createdAt?: string;
}

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  department: string;
  email?: string;
  phone?: string;
  imageUrl?: string; // Legacy format (deprecated)
  images?: ImageVariants; // New format (preferred)
  createdAt?: string;
}

interface Robot {
  _id: string;
  name: string;
  type: string;
  category: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  specs: string[];
  tags: string[];
  features?: string[];
  achievements?: string[];
  year?: number;
  status?: string;
  teamLead?: string;
  createdAt?: string;
}

interface Competition {
  id: string;
  name: string;
  organizer: string;
  year: number;
  achievement: string;
  domain: string;
}

interface DataContextType {
  galleryImages: GalleryImage[];
  teamMembers: TeamMember[];
  robots: Robot[];
  competitions: Competition[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [robots, setRobots] = useState<Robot[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load static data directly (no API calls)
      setGalleryImages(galleryData);
      setTeamMembers(teamData);
      setRobots(robotsData);

      console.log('📊 DataContext loaded:', {
        galleryCount: galleryData.length,
        teamCount: teamData.length,
        robotsCount: robotsData.length,
        categoryCounts: {
          robots: galleryData.filter(item => item.category === 'robots').length,
          events: galleryData.filter(item => item.category === 'events').length,
          workshops: galleryData.filter(item => item.category === 'workshops').length,
        }
      });

      // Static competitions data
      const competitionsData = [
        {
          id: '1',
          name: 'e-Yantra Robotics Competition',
          organizer: 'IIT Bombay',
          year: 2024,
          achievement: 'Finalist',
          domain: 'Robotics',
        },
        {
          id: '2',
          name: 'DD Robocon India',
          organizer: 'Doordarshan',
          year: 2024,
          achievement: 'National Participation',
          domain: 'Automation',
        },
        {
          id: '3',
          name: 'Techfest IIT Bombay',
          organizer: 'IIT Bombay',
          year: 2024,
          achievement: 'Top 10',
          domain: 'Robotics',
        },
      ];
      setCompetitions(competitionsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Data Context Error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        galleryImages,
        teamMembers,
        robots,
        competitions,
        isLoading,
        error,
        refetch: loadAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useGlobalData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useGlobalData must be used within DataProvider');
  }
  return context;
}
