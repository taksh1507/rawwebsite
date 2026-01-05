/**
 * Competitions API Route - Admin Panel
 * Handles CRUD operations for competition management
 */

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// GET - Fetch all competitions or active ones
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('teamraw');
    
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('active') === 'true';

    const query = activeOnly ? { isActive: true } : {};
    
    const competitions = await db
      .collection('competitions')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: competitions,
    });
  } catch (error) {
    console.error('Error fetching competitions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch competitions' },
      { status: 500 }
    );
  }
}

// POST - Create new competition
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('teamraw');
    
    const body = await request.json();
    
    const competition = {
      name: body.name,
      organizer: body.organizer,
      date: body.date,
      description: body.description,
      deadline: body.deadline,
      teamSize: body.teamSize,
      imageUrl: body.imageUrl || null,
      isActive: body.isActive ?? true,
      customFields: body.customFields || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection('competitions').insertOne(competition);

    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...competition },
    });
  } catch (error) {
    console.error('Error creating competition:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create competition' },
      { status: 500 }
    );
  }
}
