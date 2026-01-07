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
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Team RAW - Admin Login Verification</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f9;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f4f6f9; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <!-- Main Container -->
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(10, 26, 58, 0.08); overflow: hidden;">
                    
                    <!-- Header Section -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #0a1a3a 0%, #1a2f5a 60%, #e10600 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: 3px; text-transform: uppercase;">
                          TEAM <span style="color: #e10600; background: rgba(255, 255, 255, 0.15); padding: 2px 12px; border-radius: 4px;">RAW</span>
                        </h1>
                        <p style="margin: 12px 0 0 0; font-size: 14px; color: rgba(255, 255, 255, 0.9); letter-spacing: 1px; font-weight: 500;">
                          ROBOTICS & AUTOMATION WING
                        </p>
                        <p style="margin: 6px 0 0 0; font-size: 12px; color: rgba(255, 255, 255, 0.75); letter-spacing: 0.5px;">
                          St. Francis Institute of Technology
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Content Section -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <!-- Title -->
                        <h2 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 600; color: #0a1a3a; letter-spacing: 0.5px;">
                          Admin Login Verification
                        </h2>
                        
                        <!-- Body Text -->
                        <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.7; color: #4a5568;">
                          You have requested to access the Team RAW Admin Dashboard. Please use the One-Time Password below to complete your authentication.
                        </p>
                        
                        <!-- OTP Box -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 32px 0;">
                          <tr>
                            <td align="center" style="background: linear-gradient(135deg, #0a1a3a 0%, #1a2f5a 100%); padding: 24px; border-radius: 8px; border: 3px solid #e10600;">
                              <p style="margin: 0 0 8px 0; font-size: 13px; color: rgba(255, 255, 255, 0.7); letter-spacing: 1px; text-transform: uppercase; font-weight: 600;">
                                Your OTP Code
                              </p>
                              <p style="margin: 0; font-size: 38px; font-weight: 700; color: #ffffff; letter-spacing: 12px; font-family: 'Courier New', monospace;">
                                ${otp}
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Divider -->
                        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                        
                        <!-- Important Note -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7fafc; border-left: 4px solid #e10600; padding: 16px 20px; border-radius: 4px; margin: 24px 0;">
                          <tr>
                            <td>
                              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #2d3748; font-weight: 600;">
                                Important Information
                              </p>
                              <p style="margin: 8px 0 0 0; font-size: 13px; line-height: 1.6; color: #4a5568;">
                                This OTP will expire in 10 minutes. Do not share this code with anyone.
                              </p>
                            </td>
                          </tr>
                        </table>
                        
                        <!-- Security Notice -->
                        <p style="margin: 24px 0 0 0; font-size: 14px; line-height: 1.7; color: #718096;">
                          If you did not request this authentication, please disregard this email. Your account security will not be affected.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer Section -->
                    <tr>
                      <td style="background-color: #f7fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0; font-size: 12px; color: #718096; line-height: 1.5;">
                          This email was sent from Team RAW's Admin Panel.
                        </p>
                      </td>
                    </tr>
                    
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
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
