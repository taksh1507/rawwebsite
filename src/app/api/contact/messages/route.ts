/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// Handle CORS preflight
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Max-Age', '86400');
  return response;
}

// Types
interface ContactMessage {
  fullName: string;
  email: string;
  inquiryType: 'general' | 'membership' | 'sponsorship' | 'collaboration';
  message: string;
  timestamp: string;
  status: 'unread' | 'read';
  replied?: boolean;
}

// Validation helper
function validateContactData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length < 2) {
    errors.push('Full name is required and must be at least 2 characters');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Valid email address is required');
  }

  const validInquiryTypes = ['general', 'membership', 'sponsorship', 'collaboration'];
  if (!data.inquiryType || !validInquiryTypes.includes(data.inquiryType)) {
    errors.push('Valid inquiry type is required');
  }

  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    errors.push('Message is required and must be at least 10 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Sanitize input
function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// POST - Create new contact message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📨 Received contact form data:', body);

    // Validate input
    const validation = validateContactData(body);
    if (!validation.valid) {
      console.log('❌ Validation failed:', validation.errors);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors: validation.errors 
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const newMessage: ContactMessage = {
      fullName: sanitizeInput(body.fullName),
      email: sanitizeInput(body.email),
      inquiryType: body.inquiryType,
      message: sanitizeInput(body.message),
      timestamp: new Date().toISOString(),
      status: 'unread',
      replied: false,
    };

    // Save to MongoDB
    const db = await getDatabase();
    const collection = db.collection('contacts');
    const result = await collection.insertOne(newMessage);

    console.log('✅ Contact message saved to MongoDB:', result.insertedId);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Contact message received successfully',
        data: { id: result.insertedId },
      },
      { status: 201 }
    );

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error creating contact message:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );

    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}

// GET - Fetch all contact messages (sorted by latest)
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    const collection = db.collection('contacts');
    
    // Fetch all contacts and sort by timestamp (newest first)
    const contacts = await collection
      .find({})
      .sort({ timestamp: -1 })
      .toArray();

    // Get counts
    const unreadCount = contacts.filter(c => c.status === 'unread').length;
    const totalCount = contacts.length;

    const response = NextResponse.json({
      success: true,
      data: contacts,
      meta: {
        total: totalCount,
        unread: unreadCount,
      },
    });

    // Add CORS headers for admin panel
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch contact messages',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );

    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}
