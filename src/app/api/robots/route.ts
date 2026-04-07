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
interface Robot {
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
  createdAt: string;
}

// POST - Create new robot
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.type || !body.category || !body.description || !body.imageUrl) {
      return NextResponse.json(
        {
          success: false,
          message: 'Name, type, category, description, and image are required',
        },
        { status: 400 }
      );
    }

    const newRobot: Robot = {
      name: body.name.trim(),
      type: body.type.trim(),
      category: body.category,
      description: body.description.trim(),
      longDescription: body.longDescription?.trim() || '',
      imageUrl: body.imageUrl.trim(),
      specs: body.specs || [],
      tags: body.tags || [],
      features: body.features || [],
      achievements: body.achievements || [],
      year: body.year || new Date().getFullYear(),
      status: body.status || 'active',
      teamLead: body.teamLead || 'Team RAW',
      createdAt: new Date().toISOString(),
    };

    // Save to MongoDB
    const db = await getDatabase();
    const collection = db.collection('robots');
    const result = await collection.insertOne(newRobot);

    console.log('✅ Robot created in MongoDB:', result.insertedId);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Robot created successfully',
        data: { id: result.insertedId, ...newRobot },
      },
      { status: 201 }
    );

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error creating robot:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create robot',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET - Fetch all robots
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const db = await getDatabase();
    const collection = db.collection('robots');

    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const robots = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    console.log('✅ Robots fetched from MongoDB:', robots.length, 'robots');

    const response = NextResponse.json({
      success: true,
      data: robots,
      count: robots.length,
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error fetching robots:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch robots',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}
