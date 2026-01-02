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
interface GalleryImage {
  title: string;
  description?: string;
  imageUrl: string;
  category: string;
  uploadedBy?: string;
  year?: number;
  createdAt: string;
}

// POST - Create new gallery image
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.imageUrl || !body.category) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title, image URL, and category are required',
        },
        { status: 400 }
      );
    }

    const newImage: GalleryImage = {
      title: body.title.trim(),
      description: body.description?.trim() || '',
      imageUrl: body.imageUrl.trim(),
      category: body.category,
      uploadedBy: body.uploadedBy || 'Admin',
      year: body.year || new Date().getFullYear(),
      createdAt: new Date().toISOString(),
    };

    // Save to MongoDB
    const db = await getDatabase();
    const collection = db.collection('gallery');
    const result = await collection.insertOne(newImage);

    console.log('✅ Gallery image created in MongoDB:', result.insertedId);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Gallery image created successfully',
        data: { id: result.insertedId, ...newImage },
      },
      { status: 201 }
    );

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error creating gallery image:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create gallery image',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET - Fetch all gallery images
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const db = await getDatabase();
    const collection = db.collection('gallery');

    const filter: any = {};
    if (category && category !== 'all') {
      filter.category = category;
    }

    const images = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    console.log('✅ Gallery images fetched from MongoDB:', images.length, 'images');

    const response = NextResponse.json({
      success: true,
      data: images,
      count: images.length,
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch gallery images',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}
