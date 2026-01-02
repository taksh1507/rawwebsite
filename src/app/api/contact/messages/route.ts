/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Types
interface ContactMessage {
  _id: string;
  fullName: string;
  email: string;
  inquiryType: 'general' | 'membership' | 'sponsorship' | 'collaboration';
  message: string;
  timestamp: string;
  status: 'unread' | 'read';
  replied?: boolean;
}

// Data file path
const DATA_DIR = path.join(process.cwd(), 'data');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

// Read contacts from file
async function readContacts(): Promise<ContactMessage[]> {
  try {
    const data = await fs.readFile(CONTACTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty array
    return [];
  }
}

// Write contacts to file
async function writeContacts(contacts: ContactMessage[]) {
  await ensureDataDir();
  await fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
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
      _id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fullName: sanitizeInput(body.fullName),
      email: sanitizeInput(body.email),
      inquiryType: body.inquiryType,
      message: sanitizeInput(body.message),
      timestamp: new Date().toISOString(),
      status: 'unread',
      replied: false,
    };

    // Read existing contacts
    const contacts = await readContacts();

    // Add new message to the beginning
    contacts.unshift(newMessage);

    // Write back to file
    await writeContacts(contacts);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Contact message received successfully',
        data: { id: newMessage._id },
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
    const contacts = await readContacts();

    // Sort by timestamp (newest first)
    const sortedContacts = contacts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Get counts
    const unreadCount = contacts.filter(c => c.status === 'unread').length;
    const totalCount = contacts.length;

    const response = NextResponse.json({
      success: true,
      data: sortedContacts,
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
