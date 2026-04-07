/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

// Environment configuration for main website
export const config = {
  // Site URLs
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001',
  
  // API endpoints
  api: {
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    contact: '/api/contact/messages',
    chat: '/api/chat',
  },
  
  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: 'teamraw',
    collections: {
      contacts: 'contacts',
      team: 'team',
      robots: 'robots',
      gallery: 'gallery',
    },
  },
  
  // Feature flags
  features: {
    useMongoDB: !!process.env.MONGODB_URI,
    useFileStorage: !process.env.MONGODB_URI,
  },
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;
