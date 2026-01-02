/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Extract token from cookies or headers
    const token = extractToken(request);

    if (!token) {
      return NextResponse.json(
        {
          authenticated: false,
          message: 'No authentication token found',
        },
        { status: 401 }
      );
    }

    // Verify token
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          authenticated: false,
          message: 'Invalid or expired token',
        },
        { status: 401 }
      );
    }

    // Token is valid
    return NextResponse.json(
      {
        authenticated: true,
        admin: {
          email: payload.email,
          role: payload.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      {
        authenticated: false,
        message: 'Authentication verification failed',
      },
      { status: 500 }
    );
  }
}
