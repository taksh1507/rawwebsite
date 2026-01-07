import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { recipients, subject, message } = await request.json();

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No recipients provided' },
        { status: 400 }
      );
    }

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    // Check if email configuration exists
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json(
        { success: false, error: 'Email configuration not found. Please set EMAIL_USER and EMAIL_PASS environment variables.' },
        { status: 500 }
      );
    }

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send emails
    let sentCount = 0;
    const failedEmails: string[] = [];

    for (const recipientEmail of recipients) {
      try {
        const mailOptions = {
          from: {
            name: 'Team RAW - SFIT',
            address: process.env.EMAIL_USER,
          },
          to: recipientEmail,
          subject: subject,
          html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Team RAW - Official Communication</title>
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
                          <!-- Main Message -->
                          <div style="font-size: 15px; line-height: 1.8; color: #2d3748; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</div>
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
        };

        await transporter.sendMail(mailOptions);
        sentCount++;
      } catch (emailError) {
        console.error(`Failed to send email to ${recipientEmail}:`, emailError);
        failedEmails.push(recipientEmail);
      }
    }

    return NextResponse.json({
      success: true,
      sentCount,
      totalAttempted: recipients.length,
      failedEmails: failedEmails.length > 0 ? failedEmails : undefined,
    });

  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send emails' },
      { status: 500 }
    );
  }
}
