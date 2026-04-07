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

// GET - Fetch single gallery image by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const collection = db.collection('gallery');
    
    const image = await collection.findOne({ _id: new ObjectId(id) });

    if (!image) {
      const response = NextResponse.json(
        {
          success: false,
          message: 'Gallery image not found',
        },
        { status: 404 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    const response = NextResponse.json({
      success: true,
      data: image,
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch gallery image',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}

// PATCH - Update existing gallery image
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await getDatabase();
    const collection = db.collection('gallery');

    // Prepare update data with all supported fields
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.detailedDescription !== undefined) updateData.detailedDescription = body.detailedDescription;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.uploadedBy !== undefined) updateData.uploadedBy = body.uploadedBy;
    if (body.year !== undefined) updateData.year = body.year;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.date !== undefined) updateData.date = body.date;
    if (body.participants !== undefined) updateData.participants = body.participants;
    if (body.highlights !== undefined) updateData.highlights = body.highlights;

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Gallery image not found',
        },
        { status: 404 }
      );
    }

    console.log('✅ Gallery image updated in MongoDB:', id);

    const response = NextResponse.json({
      success: true,
      message: 'Gallery image updated successfully',
      data: result,
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error updating gallery image:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to update gallery image',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}

// DELETE - Delete gallery image
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const collection = db.collection('gallery');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Gallery image not found',
        },
        { status: 404 }
      );
    }

    console.log('✅ Gallery image deleted from MongoDB:', id);

    const response = NextResponse.json({
      success: true,
      message: 'Gallery image deleted successfully',
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to delete gallery image',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}
