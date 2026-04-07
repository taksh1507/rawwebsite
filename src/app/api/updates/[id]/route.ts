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

// GET - Fetch single update by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const collection = db.collection('updates');
    
    const update = await collection.findOne({ _id: new ObjectId(id) });

    if (!update) {
      const response = NextResponse.json(
        {
          success: false,
          message: 'Update not found',
        },
        { status: 404 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    const response = NextResponse.json({
      success: true,
      data: update,
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error fetching update:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch update',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}

// PATCH - Update existing update
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await getDatabase();
    const collection = db.collection('updates');

    // Find and update the update
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: body },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Update not found',
        },
        { status: 404 }
      );
    }

    console.log('✅ Update modified in MongoDB:', id);

    const response = NextResponse.json({
      success: true,
      message: 'Update modified successfully',
      data: result,
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error updating update:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to update update',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}

// DELETE - Delete update
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const collection = db.collection('updates');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Update not found',
        },
        { status: 404 }
      );
    }

    console.log('✅ Update deleted from MongoDB:', id);

    const response = NextResponse.json({
      success: true,
      message: 'Update deleted successfully',
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error deleting update:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to delete update',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}
