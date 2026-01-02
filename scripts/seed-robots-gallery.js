/**
 * Seed script to add sample robots and gallery data to MongoDB
 * Run with: node scripts/seed-robots-gallery.js
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://teamraw:TeamRaw@cluster0.jroqyqd.mongodb.net/';
const DB_NAME = 'teamraw';

const sampleRobots = [
  {
    name: 'AutoTrace Pro',
    type: 'Line Follower',
    category: 'competition',
    description: 'High-speed autonomous line-following robot with advanced PID control',
    longDescription: 'AutoTrace Pro is our flagship line-following robot, featuring precision IR sensors, PWM motor control, and real-time path optimization algorithms. Competed in multiple national-level robotics competitions.',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    specs: ['8 IR Sensors Array', 'PID Control', '45cm/s Max Speed', 'Arduino Mega 2560'],
    tags: ['Autonomous', 'Competition'],
    features: ['Real-time path tracking', 'Adaptive speed control', 'Error correction'],
    achievements: ['1st Place - TechFest 2024', 'Finalist - Robocon 2024'],
    year: 2024,
    status: 'active',
    teamLead: 'Taksh Gandhi',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'MazeMaster',
    type: 'Maze Solver',
    category: 'research',
    description: 'Intelligent maze-solving robot with wall-following algorithm',
    longDescription: 'MazeMaster uses ultrasonic sensors and the left-hand rule algorithm to navigate complex mazes. Features real-time decision making and path memory.',
    imageUrl: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=800&h=600&fit=crop',
    specs: ['4 Ultrasonic Sensors', 'Arduino Uno', 'Left-hand Algorithm', '20cm/s Speed'],
    tags: ['Navigation', 'Research'],
    features: ['Wall detection', 'Path memory', 'Automatic backtracking'],
    achievements: ['Best Innovation Award 2024'],
    year: 2024,
    status: 'active',
    teamLead: 'Team RAW',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'RoboArm X1',
    type: 'Robotic Arm',
    category: 'development',
    description: 'Precision robotic arm for pick and place operations',
    longDescription: 'A 5-DOF robotic arm capable of precise object manipulation. Uses servo motors for accurate positioning and can handle objects up to 500g.',
    imageUrl: 'https://images.unsplash.com/photo-1563191911-e65f8655ebf9?w=800&h=600&fit=crop',
    specs: ['5-DOF Configuration', '500g Payload', 'Servo Control', 'ESP32'],
    tags: ['Manipulation', 'Precision'],
    features: ['Inverse kinematics', 'Gripper control', 'Position memory'],
    achievements: [],
    year: 2023,
    status: 'development',
    teamLead: 'Team RAW',
    createdAt: new Date().toISOString(),
  },
];

const sampleGallery = [
  {
    title: 'TechFest 2024 Competition',
    description: 'Team RAW competing at IIT Bombay TechFest 2024',
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop',
    category: 'events',
    uploadedBy: 'Admin',
    year: 2024,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Robotics Workshop Session',
    description: 'Hands-on workshop on Arduino programming and sensor integration',
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop',
    category: 'workshops',
    uploadedBy: 'Admin',
    year: 2024,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'DD Robocon 2024',
    description: 'National level robotics competition participation',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
    category: 'competitions',
    uploadedBy: 'Admin',
    year: 2024,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Team Building Activity',
    description: 'Team RAW members collaborating on new robot design',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
    category: 'team',
    uploadedBy: 'Admin',
    year: 2024,
    createdAt: new Date().toISOString(),
  },
  {
    title: 'AutoTrace in Action',
    description: 'Line follower robot during testing phase',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    category: 'robots',
    uploadedBy: 'Admin',
    year: 2024,
    createdAt: new Date().toISOString(),
  },
];

async function seedData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔗 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(DB_NAME);

    // Seed Robots
    console.log('\n📦 Seeding robots collection...');
    const robotsCollection = db.collection('robots');
    const existingRobots = await robotsCollection.countDocuments();
    
    if (existingRobots > 0) {
      console.log(`ℹ️  Found ${existingRobots} existing robots. Skipping robots seed.`);
      console.log('   (Delete collection to re-seed or use different data)');
    } else {
      const robotsResult = await robotsCollection.insertMany(sampleRobots);
      console.log(`✅ Inserted ${robotsResult.insertedCount} robots`);
    }

    // Seed Gallery
    console.log('\n📸 Seeding gallery collection...');
    const galleryCollection = db.collection('gallery');
    const existingGallery = await galleryCollection.countDocuments();
    
    if (existingGallery > 0) {
      console.log(`ℹ️  Found ${existingGallery} existing gallery items. Skipping gallery seed.`);
      console.log('   (Delete collection to re-seed or use different data)');
    } else {
      const galleryResult = await galleryCollection.insertMany(sampleGallery);
      console.log(`✅ Inserted ${galleryResult.insertedCount} gallery items`);
    }

    console.log('\n🎉 Seeding complete!');
    console.log('\n📊 Summary:');
    console.log(`   Robots: ${await robotsCollection.countDocuments()} total`);
    console.log(`   Gallery: ${await galleryCollection.countDocuments()} total`);
    console.log('\n🌐 View your data at:');
    console.log('   Main Site: https://rawwebsite-seven.vercel.app/robots-gallery');
    console.log('   Admin Panel: https://rawwebsiteadmin.vercel.app/dashboard/robots');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 Database connection closed');
  }
}

seedData();
