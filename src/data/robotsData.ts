/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

/**
 * ROBOTS DATA STRUCTURE
 * Real Team RAW robots data
 */

export interface Robot {
  _id: string;
  name: string;
  type: string;
  category: 'competition' | 'research' | 'development';
  description: string;
  longDescription?: string;
  imageUrl: string;
  specs: string[];
  tags: string[];
  features?: string[];
  achievements?: string[];
  year?: number;
  status?: 'active' | 'retired' | 'development';
  teamLead?: string;
  createdAt?: string;
}

export const robotsData: Robot[] = [
  {
    _id: 'robot-robocon-2025-1',
    name: 'DD Robocon 2025 Robot 1',
    type: 'Competition Robot',
    category: 'competition',
    description: 'First robot for DD Robocon 2025 competition',
    longDescription: 'Advanced competition robot designed for DD Robocon 2025 challenges with precise control systems and innovative mechanisms.',
    imageUrl: '/images/gallery/placeholder.jpg',
    specs: ['Autonomous Navigation', 'Manual Control', 'Multi-task Capability', 'High Precision'],
    tags: ['DD Robocon', 'Competition', '2025'],
    features: [
      'Advanced control systems',
      'Innovative mechanical design',
      'Robust construction',
      'Competition-ready performance',
    ],
    achievements: ['DD Robocon 2025 Participant'],
    year: 2025,
    status: 'active',
    teamLead: 'Team RAW',
    createdAt: '2024-12-01',
  },
  {
    _id: 'robot-robocon-2025-2',
    name: 'DD Robocon 2025 Robot 2',
    type: 'Competition Robot',
    category: 'competition',
    description: 'Second robot for DD Robocon 2025 competition',
    longDescription: 'Complementary robot for DD Robocon 2025 featuring specialized mechanisms for team strategy execution.',
    imageUrl: '/images/gallery/placeholder.jpg',
    specs: ['Team Coordination', 'Specialized Tasks', 'High Speed', 'Precision Control'],
    tags: ['DD Robocon', 'Competition', '2025'],
    features: [
      'Team coordination systems',
      'Specialized mechanisms',
      'Fast response time',
      'Strategic capability',
    ],
    achievements: ['DD Robocon 2025 Participant'],
    year: 2025,
    status: 'active',
    teamLead: 'Team RAW',
    createdAt: '2024-11-28',
  },
  {
    _id: 'robot-robocon-2024',
    name: 'DD Robocon 2024 Robot',
    type: 'Competition Robot',
    category: 'competition',
    description: 'Competition robot for DD Robocon 2024',
    longDescription: 'Proven competition robot that participated in DD Robocon 2024, showcasing Team RAW\'s engineering excellence.',
    imageUrl: '/images/gallery/placeholder.jpg',
    specs: ['Autonomous Mode', 'Manual Mode', 'Task Execution', 'Reliable Performance'],
    tags: ['DD Robocon', 'Competition', '2024'],
    features: [
      'Dual operation modes',
      'Competition-tested design',
      'Efficient mechanisms',
      'Team strategy integration',
    ],
    achievements: ['DD Robocon 2024 Participant'],
    year: 2024,
    status: 'retired',
    teamLead: 'Team RAW',
    createdAt: '2024-11-25',
  },
  {
    _id: 'robot-robocon-2023',
    name: 'DD Robocon 2023 Robot',
    type: 'Competition Robot',
    category: 'competition',
    description: 'Competition robot for DD Robocon 2023',
    longDescription: 'Legacy robot from DD Robocon 2023, representing the foundation of Team RAW\'s robotics journey.',
    imageUrl: '/images/gallery/placeholder.jpg',
    specs: ['Basic Autonomous', 'Manual Control', 'Task Oriented', 'Learning Platform'],
    tags: ['DD Robocon', 'Competition', '2023'],
    features: [
      'Foundation design principles',
      'Competition experience',
      'Learning platform',
      'Team building tool',
    ],
    achievements: ['DD Robocon 2023 Participant'],
    year: 2023,
    status: 'retired',
    teamLead: 'Team RAW',
    createdAt: '2024-11-20',
  },
];

export default robotsData;