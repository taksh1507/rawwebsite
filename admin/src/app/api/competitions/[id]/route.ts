/**
 * Competition Detail API Route - Admin Panel
 * Handles individual competition operations
 */

import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

// PATCH - Update competition
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('teamraw');
    
    const body = await request.json();
    
    const updateData = {
      name: body.name,
      organizer: body.organizer,
      date: body.date,
      description: body.description,
      deadline: body.deadline,
      teamSize: body.teamSize,
      imageUrl: body.imageUrl || null,
      notes: body.notes || '',
      isActive: body.isActive ?? true,
      customFields: body.customFields || [],
      updatedAt: new Date().toISOString(),
    };

    const result = await db
      .collection('competitions')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Competition not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { _id: id, ...updateData },
    });
  } catch (error) {
    console.error('Error updating competition:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update competition' },
      { status: 500 }
    );
  }
}

// DELETE - Delete competition
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db('teamraw');

    const result = await db
      .collection('competitions')
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Competition not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Competition deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting competition:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete competition' },
      { status: 500 }
    );
  }
}
