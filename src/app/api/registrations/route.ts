import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// POST - Create new registration
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('teamraw');
    
    const body = await request.json();
    
    const registration = {
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      competition: body.competition,
      competitionId: body.competitionId,
      whyJoin: body.whyJoin || '',
      expectations: body.expectations || '',
      customFields: body.customFields || {},
      status: 'pending', // pending, approved, rejected
      submittedAt: new Date().toISOString(),
    };

    const result = await db.collection('registrations').insertOne(registration);
    
    return NextResponse.json({
      success: true,
      data: { _id: result.insertedId, ...registration },
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}

// GET - Get all registrations (for admin)
export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('teamraw');
    
    const { searchParams } = new URL(request.url);
    const competitionId = searchParams.get('competitionId');
    const status = searchParams.get('status');
    
    const filter: any = {};
    if (competitionId) filter.competitionId = competitionId;
    if (status) filter.status = status;
    
    const registrations = await db
      .collection('registrations')
      .find(filter)
      .sort({ submittedAt: -1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      data: registrations,
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}
