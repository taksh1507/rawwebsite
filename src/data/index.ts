/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

/**
 * Central data exports
 * Import all data from a single location for convenience
 */

// Export all data
export { default as galleryData, galleryImages, getImagesByCategory, getRecentImages } from './galleryData';
export type { GalleryImage } from './galleryData';

export { default as teamData, teamMembers } from './teamData';
export type { TeamMember } from './teamData';

export { 
  default as robotsData, 
  robotsData as robots
} from './robotsData';
export type { Robot } from './robotsData';
