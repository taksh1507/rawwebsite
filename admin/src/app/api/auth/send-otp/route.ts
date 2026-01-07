/**
 * Author: Taksh Gandhi
 * Email: takshgandhi4@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { otpStore } from '@/lib/otpStore';

// Generate random 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/contact/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: 'Team RAW Admin Login - OTP Verification',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
            <div style="background: linear-gradient(135deg, #0a1a3a 0%, #1a2f5a 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px;">TEAM <span style="color: #e10600;">RAW</span></h1>
              <p style="color: #ffffff; margin: 10px 0 0 0;">Admin Login Verification</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #0a1a3a; margin-top: 0;">Your Login OTP</h2>
              <p style="color: #666; line-height: 1.6;">You've requested to log in to the Team RAW Admin Dashboard. Please use the following One-Time Password to complete your login:</p>
              
              <div style="background: linear-gradient(135deg, #e10600 0%, #c90000 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <p style="color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0;">${otp}</p>
              </div>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                <strong>⏱️ This OTP will expire in 10 minutes.</strong>
              </p>
              
              <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                If you didn't request this login, please ignore this email and your account will remain secure.
              </p>
              
              <div style="border-top: 2px solid #e10600; padding-top: 20px; margin-top: 30px;">
                <p style="color: #999; font-size: 12px; margin: 5px 0;">
                  This is an automated email from Team RAW Admin System.
                </p>
                <p style="color: #999; font-size: 12px; margin: 5px 0;">
                  © ${new Date().getFullYear()} Team RAW - St. Francis Institute of Technology
                </p>
              </div>
            </div>
          </div>
        `,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
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

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(email.toLowerCase(), otp, expiresAt);

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return NextResponse.json(
        { success: false, message: 'Failed to send OTP email. Please try again.' },
        { status: 500 }
      );
    }

    // Clean up expired OTPs
    setTimeout(() => {
      const stored = otpStore.get(email.toLowerCase());
      if (stored && Date.now() > stored.expiresAt) {
        otpStore.delete(email.toLowerCase());
      }
    }, 10 * 60 * 1000);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your email',
    });
  } catch (error) {
    console.error('Error in send-otp:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
