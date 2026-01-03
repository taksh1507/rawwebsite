/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

/**
 * TEAM DATA STRUCTURE
 * Optimized for WebP images with lazy loading and responsive layouts
 */

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  department: string;
  email?: string;
  phone?: string;
  imageUrl: string;
  category: 'core' | 'mentors' | 'members' | 'alumni';
  createdAt?: string;
}

export const teamMembers: TeamMember[] = [
  // CORE TEAM
  {
    _id: 'core1',
    name: 'Ramjee Yadav',
    role: 'FACULTY IN-CHARGE',
    department: 'Management',
    category: 'core',
    imageUrl: '/logo.png',
    createdAt: '2024-01-15',
  },
  {
    _id: 'core2',
    name: 'Siddhant Monde',
    role: 'CRC',
    department: 'Electronics',
    category: 'core',
    imageUrl: '/siddhant.jpg',
    createdAt: '2024-01-15',
  },
  {
    _id: 'core3',
    name: 'Dittino Thomas',
    role: 'CO-CRC',
    department: 'Designer',
    category: 'core',
    imageUrl: '/dittino.jpg',
    createdAt: '2024-01-15',
  },
  {
    _id: 'core4',
    name: 'Taksh Gandhi',
    role: 'TREASURER',
    department: 'Coder',
    category: 'core',
    imageUrl: '/Taksh.jpg',
    createdAt: '2024-01-15',
  },
  {
    _id: 'core5',
    name: 'Saish Loke',
    role: 'CO-TREASURER',
    department: 'Electronics',
    category: 'core',
    imageUrl: '/logo.png',
    createdAt: '2024-01-15',
  },
  {
    _id: 'core6',
    name: 'Dikshi Adani',
    role: 'SECRETARY',
    department: 'Coder',
    category: 'core',
    imageUrl: '/Dikshi.jpg',
    createdAt: '2024-01-15',
  },
  {
    _id: 'core7',
    name: 'Samruddhi Khuarl',
    role: 'CO-SECRETARY',
    department: 'Coder',
    category: 'core',
    imageUrl: '/samruddhi.jpg',
    createdAt: '2024-01-15',
  },
  {
    _id: 'core8',
    name: 'Nandini Salunke',
    role: 'EVENT HEAD',
    department: 'Coder',
    category: 'core',
    imageUrl: '/nandini.jpg',
    createdAt: '2024-01-15',
  },
  {
    _id: 'core9',
    name: 'Aryan Wasnik',
    role: 'CO-EVENT HEAD',
    department: 'Electronics',
    category: 'core',
    imageUrl: '/aryan.jpg',
    createdAt: '2024-01-15',
  },
  {
    _id: 'core10',
    name: 'Amisha',
    role: 'PUBLICITY HEAD',
    department: 'Designer',
    category: 'core',
    imageUrl: '/logo.png',
    createdAt: '2024-01-15',
  },
  {
    _id: 'core11',
    name: 'Pal Rajak',
    role: 'CO-PUBLICITY HEAD',
    department: 'PR',
    category: 'core',
    imageUrl: '/pal.jpg',
    createdAt: '2024-01-15',
  },
  {
    _id: 'core12',
    name: 'Shail Raut',
    role: 'INVENTORY HEAD',
    department: 'Designer',
    category: 'core',
    imageUrl: '/Shell.jpg',
    createdAt: '2024-01-15',
  },
  {
    _id: 'core13',
    name: 'Jash Mewada',
    role: 'INVENTORY MANAGER',
    department: 'Coder',
    category: 'core',
    imageUrl: '/Jash.jpg',
    createdAt: '2024-01-15',
  },
  // MENTORS
  {
    _id: 'mentor1',
    name: 'Shreehari Punna',
    role: 'MENTOR & EX-CRC',
    department: 'Electronics',
    category: 'mentors',
    imageUrl: '/shreehari.jpg',
    createdAt: '2024-02-01',
  },
  {
    _id: 'mentor2',
    name: 'Diyanshu Modi',
    role: 'MENTOR',
    department: 'Coder Electronics',
    category: 'mentors',
    imageUrl: '/logo.png',
    createdAt: '2024-02-01',
  },
  {
    _id: 'mentor3',
    name: 'Yash Pathak',
    role: 'MENTOR',
    department: 'Designer Coder',
    category: 'mentors',
    imageUrl: '/logo.png',
    createdAt: '2024-02-01',
  },
  {
    _id: 'mentor4',
    name: 'Hrushikesh Auti',
    role: 'MENTOR',
    department: 'Designer',
    category: 'mentors',
    imageUrl: '/Hrushikhi.jpg',
    createdAt: '2024-02-01',
  },
  // TEAM MEMBERS
  {
    _id: 'member1',
    name: 'Swanand Deshpande',
    role: 'TEAM MEMBER',
    department: 'Technical',
    category: 'members',
    imageUrl: '/Swanand.jpg',
    createdAt: '2024-03-10',
  },
  {
    _id: 'member2',
    name: 'Jhoshua Coutinho',
    role: 'TEAM MEMBER',
    department: 'Technical',
    category: 'members',
    imageUrl: '/Joshua.jpg',
    createdAt: '2024-03-10',
  },
  {
    _id: 'member3',
    name: 'Siddha Shete',
    role: 'TEAM MEMBER',
    department: 'Technical',
    category: 'members',
    imageUrl: '/siddha.jpg',
    createdAt: '2024-03-10',
  },
  {
    _id: 'member4',
    name: 'Sarthak Chaurasiya',
    role: 'TEAM MEMBER',
    department: 'Technical',
    category: 'members',
    imageUrl: '/sarthak.jpg',
    createdAt: '2024-03-10',
  },
  {
    _id: 'member5',
    name: 'Jay Lohar',
    role: 'TEAM MEMBER',
    department: 'Technical',
    category: 'members',
    imageUrl: '/Jay.jpg',
    createdAt: '2024-03-10',
  },
  {
    _id: 'member6',
    name: 'Riyan Gonsalves',
    role: 'TEAM MEMBER',
    department: 'Technical',
    category: 'members',
    imageUrl: '/Riyan.jpg',
    createdAt: '2024-03-10',
  },
  {
    _id: 'member7',
    name: 'Paarth Pradhan',
    role: 'TEAM MEMBER',
    department: 'Technical',
    category: 'members',
    imageUrl: '/logo.png',
    createdAt: '2024-03-10',
  },
  {
    _id: 'member8',
    name: 'Sakshi Virani',
    role: 'TEAM MEMBER',
    department: 'Technical',
    category: 'members',
    imageUrl: '/sakshi.jpg',
    createdAt: '2024-03-10',
  },
  {
    _id: 'member9',
    name: 'Vansh Singh',
    role: 'TEAM MEMBER',
    department: 'Technical',
    category: 'members',
    imageUrl: '/Vansh.jpg',
    createdAt: '2024-03-10',
  },
  {
    _id: 'member10',
    name: 'Jwen Lobo',
    role: 'TEAM MEMBER',
    department: 'Technical',
    category: 'members',
    imageUrl: '/Jwen.jpg',
    createdAt: '2024-03-10',
  },
  {
    _id: 'member11',
    name: 'Parth Sutar',
    role: 'TEAM MEMBER',
    department: 'Technical',
    category: 'members',
    imageUrl: '/parth.jpg',
    createdAt: '2024-03-10',
  },
  {
    _id: 'member12',
    name: 'Gunjan Patil',
    role: 'TEAM MEMBER',
    department: 'Technical',
    category: 'members',
    imageUrl: '/gunjan.jpg',
    createdAt: '2024-03-10',
  },
  {
    _id: 'member13',
    name: 'Niyant Tiwari',
    role: 'TEAM MEMBER',
    department: 'Technical',
    category: 'members',
    imageUrl: '/logo.png',
    createdAt: '2024-03-10',
  },
];

export default teamMembers;

