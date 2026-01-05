import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const emailConfigured = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    
    return NextResponse.json({
      configured: emailConfigured,
      message: emailConfigured 
        ? 'Email configuration is set' 
        : 'Email configuration is missing. Please set EMAIL_USER and EMAIL_PASS environment variables.',
    });
  } catch (error) {
    console.error('Error checking email config:', error);
    return NextResponse.json(
      { configured: false, error: 'Failed to check email configuration' },
      { status: 500 }
    );
  }
}
