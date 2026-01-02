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
interface Update {
  title: string;
  description: string;
  category: 'announcement' | 'achievement' | 'event' | 'general';
  priority: 'low' | 'medium' | 'high';
  timestamp: string;
  isActive: boolean;
  author?: string;
}

// POST - Create new update
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.description || !body.category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title, description, and category are required',
        },
        { status: 400 }
      );
    }

    const newUpdate: Update = {
      title: body.title.trim(),
      description: body.description.trim(),
      category: body.category,
      priority: body.priority || 'medium',
      timestamp: new Date().toISOString(),
      isActive: body.isActive !== undefined ? body.isActive : true,
      author: body.author || 'Admin',
    };

    // Save to MongoDB
    const db = await getDatabase();
    const collection = db.collection('updates');
    const result = await collection.insertOne(newUpdate);

    console.log('✅ Update created in MongoDB:', result.insertedId);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Update created successfully',
        data: { id: result.insertedId, ...newUpdate },
      },
      { status: 201 }
    );

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error creating update:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create update',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET - Fetch all updates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const db = await getDatabase();
    const collection = db.collection('updates');

    const filter = activeOnly ? { isActive: true } : {};
    const updates = await collection
      .find(filter)
      .sort({ timestamp: -1 })
      .toArray();

    console.log('✅ Updates fetched from MongoDB:', updates.length, 'updates');

    const response = NextResponse.json({
      success: true,
      data: updates,
      count: updates.length,
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error fetching updates:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch updates',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}
