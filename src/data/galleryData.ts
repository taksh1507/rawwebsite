/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

/**
 * STATIC GALLERY DATA
 * Replace with your image imports and gallery details
 * Images should be imported at the top
 */

export interface GalleryImage {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category: string;
  uploadedBy?: string;
  createdAt?: string;
  year?: number;
}

// TODO: Import your images here
// import RobotImage1 from '@/public/images/gallery/robot1.jpg';
// import EventImage1 from '@/public/images/gallery/event1.jpg';
// etc.

export const galleryImages: GalleryImage[] = [
  // ROBOTS
  {
    _id: 'robot1',
    title: 'DD Robocon 2025 Robot 1',
    description: 'First robot for DD Robocon 2025 competition',
    category: 'robots',
    imageUrl: '/images/gallery/placeholder.jpg',
    uploadedBy: 'Team RAW',
    createdAt: '2024-12-01',
    year: 2025,
  },
  {
    _id: 'robot2',
    title: 'DD Robocon 2025 Robot 2',
    description: 'Second robot for DD Robocon 2025 competition',
    category: 'robots',
    imageUrl: '/images/gallery/placeholder.jpg',
    uploadedBy: 'Team RAW',
    createdAt: '2024-11-28',
    year: 2025,
  },
  {
    _id: 'robot3',
    title: 'DD Robocon 2024 Robot',
    description: 'Competition robot for DD Robocon 2024',
    category: 'robots',
    imageUrl: '/images/gallery/placeholder.jpg',
    uploadedBy: 'Team RAW',
    createdAt: '2024-11-25',
    year: 2024,
  },
  {
    _id: 'robot4',
    title: 'DD Robocon 2023 Robot',
    description: 'Competition robot for DD Robocon 2023',
    category: 'robots',
    imageUrl: '/images/gallery/placeholder.jpg',
    uploadedBy: 'Team RAW',
    createdAt: '2024-11-20',
    year: 2023,
  },

  // EVENTS
  {
    _id: 'event1',
    title: 'Mosaic Event',
    description: 'Team RAW participation in Mosaic technical fest',
    category: 'events',
    imageUrl: '/images/gallery/placeholder.jpg',
    uploadedBy: 'Team RAW',
    createdAt: '2024-12-10',
    year: 2024,
  },

  // WORKSHOPS
  {
    _id: 'workshop1',
    title: 'Robotics Workshop at SFIT',
    description: 'Hands-on robotics workshop conducted at SFIT',
    category: 'workshops',
    imageUrl: '/images/gallery/placeholder.jpg',
    uploadedBy: 'Team RAW',
    createdAt: '2024-12-05',
    year: 2024,
  },
];

// Filter helper functions
export const getImagesByCategory = (category: string): GalleryImage[] => {
  return galleryImages.filter(img => img.category === category);
};

export const getRecentImages = (count: number = 10): GalleryImage[] => {
  return [...galleryImages]
    .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
    .slice(0, count);
};

export default galleryImages;

