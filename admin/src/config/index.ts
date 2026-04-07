/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

// Environment configuration for admin panel
export const adminConfig = {
  // Main website API URL
  mainSiteApiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  
  // Admin panel URL
  adminUrl: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001',
  
  // API endpoints (on main website)
  api: {
    contacts: {
      list: '/api/contact/messages',
      detail: (id: string) => `/api/contact/messages/${id}`,
      update: (id: string) => `/api/contact/messages/${id}`,
      delete: (id: string) => `/api/contact/messages/${id}`,
    },
  },
  
  // MongoDB
  mongodb: {
    uri: process.env.MONGODB_URI,
    dbName: 'teamraw',
  },
  
  // Authentication
  auth: {
    jwtSecret: process.env.JWT_SECRET,
  },
  
  // Cloudinary
  cloudinary: {
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
};

export default adminConfig;
