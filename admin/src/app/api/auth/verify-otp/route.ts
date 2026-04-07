/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/lib/auth';
import { otpStore } from '@/lib/otpStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    // Validate inputs
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    if (!otp || typeof otp !== 'string') {
      return NextResponse.json(
        { success: false, message: 'OTP is required' },
        { status: 400 }
      );
    }

    // Only allow the specific admin email
    if (email.toLowerCase() !== 'teamraw@sfit.ac.in') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized email address' },
        { status: 403 }
      );
    }

    // Get stored OTP
    const stored = otpStore.get(email.toLowerCase());

    if (!stored) {
      return NextResponse.json(
        { success: false, message: 'OTP not found or expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(email.toLowerCase());
      return NextResponse.json(
        { success: false, message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (stored.otp !== otp) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // OTP is valid - delete it and create session token
    otpStore.delete(email.toLowerCase());

    // Create JWT token
    const token = await createToken({
      email: email,
      role: 'ADMIN',
    });

    console.log('✓ OTP verified successfully for:', email);
    console.log('✓ Token created, setting cookie...');

    // Create response with token
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
    });

    // Set cookie with explicit settings
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    console.log('✓ Cookie set successfully');

    return response;
  } catch (error) {
    console.error('Error in verify-otp:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
