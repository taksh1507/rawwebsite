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
interface ContactMessage {
  fullName: string;
  email: string;
  inquiryType: 'general' | 'membership' | 'sponsorship' | 'collaboration';
  message: string;
  timestamp: string;
  status: 'unread' | 'read';
  replied?: boolean;
}

// GET - Fetch single contact message by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const collection = db.collection('contacts');
    
    const contact = await collection.findOne({ _id: new ObjectId(id) });

    if (!contact) {
      const response = NextResponse.json(
        {
          success: false,
          message: 'Contact message not found',
        },
        { status: 404 }
      );
      response.headers.set('Access-Control-Allow-Origin', '*');
      return response;
    }

    const response = NextResponse.json({
      success: true,
      data: contact,
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error fetching contact:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch contact message',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}

// PATCH - Update contact message (mark as read/replied)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const db = await getDatabase();
    const collection = db.collection('contacts');

    // Find and update the contact
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: body },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          message: 'Contact message not found',
        },
        { status: 404 }
      );
    }

    console.log('✅ Contact message updated in MongoDB:', id);

    const response = NextResponse.json({
      success: true,
      message: 'Contact message updated successfully',
      data: result,
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error updating contact:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to update contact message',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}

// DELETE - Delete contact message
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const collection = db.collection('contacts');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Contact message not found',
        },
        { status: 404 }
      );
    }

    console.log('✅ Contact message deleted from MongoDB:', id);

    const response = NextResponse.json({
      success: true,
      message: 'Contact message deleted successfully',
    });

    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Error deleting contact:', error);
    const response = NextResponse.json(
      {
        success: false,
        message: 'Failed to delete contact message',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }
}
