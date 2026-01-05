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
            <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  background: linear-gradient(135deg, #0A1A3A 0%, #E10600 100%);
                  color: white;
                  padding: 30px 20px;
                  text-align: center;
                  border-radius: 10px 10px 0 0;
                }
                .content {
                  background: #f9f9f9;
                  padding: 30px 20px;
                  border-radius: 0 0 10px 10px;
                }
                .message {
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  margin: 20px 0;
                  white-space: pre-wrap;
                  line-height: 1.8;
                }
                .footer {
                  text-align: center;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 2px solid #ddd;
                  color: #666;
                  font-size: 14px;
                }
                .logo {
                  font-size: 24px;
                  font-weight: bold;
                  letter-spacing: 2px;
                }
                a {
                  color: #E10600;
                  text-decoration: none;
                }
                a:hover {
                  text-decoration: underline;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">TEAM RAW</div>
                  <p style="margin: 10px 0 0 0;">St. Francis Institute of Technology</p>
                </div>
                <div class="content">
                  <div class="message">${message.replace(/\n/g, '<br>')}</div>
                  
                  <div class="footer">
                    <p>
                      <strong>Team RAW - Robotics and Automation Workshop</strong><br>
                      St. Francis Institute of Technology<br>
                      Email: <a href="mailto:teamraw@sfit.ac.in">teamraw@sfit.ac.in</a><br>
                      Phone: Nandini Salunke - 8329324952 | Pal Rajak - 7208697241
                    </p>
                    <p style="font-size: 12px; color: #999; margin-top: 15px;">
                      This email was sent from Team RAW's Admin Panel.
                    </p>
                  </div>
                </div>
              </div>
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
