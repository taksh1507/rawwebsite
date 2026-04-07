import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// GET - Get all registrations
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
