import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

interface Registration {
  _id: ObjectId;
  fullName: string;
  email: string;
  competition: string;
  competitionId: ObjectId;
  phone?: string;
  customFields?: Record<string, any>;
}

interface Competition {
  _id: ObjectId;
  name: string;
  customFields?: Array<{
    id: string;
    label: string;
    type: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const { registrationIds, subject, message, selectedEmails } = await request.json();

    if (!registrationIds || registrationIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No registrations selected' },
        { status: 400 }
      );
    }

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    if (!selectedEmails || Object.keys(selectedEmails).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No email addresses selected' },
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

    // Connect to MongoDB
    await client.connect();
    const database = client.db('teamraw');
    const registrationsCollection = database.collection('registrations');
    const competitionsCollection = database.collection('competitions');

    // Fetch registrations
    const objectIds = registrationIds.map((id: string) => new ObjectId(id));
    const registrations = await registrationsCollection
      .find({ _id: { $in: objectIds } })
      .toArray() as unknown as Registration[];

    if (registrations.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid registrations found' },
        { status: 404 }
      );
    }

    // Fetch all related competitions to get field labels
    const competitionIds = [...new Set(registrations.map(r => r.competitionId))];
    const competitions = await competitionsCollection
      .find({ _id: { $in: competitionIds } })
      .toArray() as unknown as Competition[];

    // Create a map for quick lookup
    const competitionMap = new Map(competitions.map(c => [c._id.toString(), c]));

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

    for (const registration of registrations) {
      // Get selected emails for this registration
      const emailsToSend = selectedEmails[registration._id.toString()] || [registration.email];
      
      // Get field labels for this registration's competition
      const competition = competitionMap.get(registration.competitionId.toString());
      let customFieldsHtml = '';
      
      if (registration.customFields && Object.keys(registration.customFields).length > 0 && competition?.customFields) {
        customFieldsHtml = '<p><strong>Additional Information:</strong></p><ul>';
        for (const [fieldId, value] of Object.entries(registration.customFields)) {
          const field = competition.customFields.find(f => f.id === fieldId);
          const label = field ? field.label : fieldId;
          const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
          customFieldsHtml += `<li>${label}: ${displayValue}</li>`;
        }
        customFieldsHtml += '</ul>';
      }

      // Send to each selected email
      for (const toEmail of emailsToSend) {
        try {
          const mailOptions = {
            from: {
              name: 'Team RAW - SFIT',
              address: process.env.EMAIL_USER,
            },
            to: toEmail,
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
                            <!-- Greeting -->
                            <p style="margin: 0 0 24px 0; font-size: 16px; font-weight: 600; color: #0a1a3a;">
                              Dear ${registration.fullName},
                            </p>
                            
                            <!-- Main Message -->
                            <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 0 0 32px 0; border-left: 4px solid #0a1a3a;">
                              <div style="font-size: 15px; line-height: 1.7; color: #2d3748; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</div>
                            </div>
                            
                            <!-- Divider -->
                            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                            
                            <!-- Registration Details Section -->
                            <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #0a1a3a; letter-spacing: 0.3px;">
                              Registration Details
                            </h3>
                            
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 0 24px 0;">
                              <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                                  <p style="margin: 0; font-size: 13px; color: #718096; font-weight: 600;">Competition</p>
                                  <p style="margin: 4px 0 0 0; font-size: 15px; color: #2d3748;">${registration.competition}</p>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                                  <p style="margin: 0; font-size: 13px; color: #718096; font-weight: 600;">Email</p>
                                  <p style="margin: 4px 0 0 0; font-size: 15px; color: #2d3748;">${registration.email}</p>
                                </td>
                              </tr>
                              ${registration.phone ? `
                              <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                                  <p style="margin: 0; font-size: 13px; color: #718096; font-weight: 600;">Phone</p>
                                  <p style="margin: 4px 0 0 0; font-size: 15px; color: #2d3748;">${registration.phone}</p>
                                </td>
                              </tr>
                              ` : ''}
                            </table>
                            
                            ${customFieldsHtml ? `
                            <!-- Additional Information Section -->
                            <h3 style="margin: 24px 0 16px 0; font-size: 18px; font-weight: 600; color: #0a1a3a; letter-spacing: 0.3px;">
                              Additional Information
                            </h3>
                            <div style="background-color: #f7fafc; padding: 16px 20px; border-radius: 8px; margin: 0 0 24px 0;">
                              ${customFieldsHtml.replace(/<ul>/g, '<div style="margin: 0;">').replace(/<\/ul>/g, '</div>').replace(/<li>/g, '<p style="margin: 8px 0; font-size: 14px; color: #4a5568; line-height: 1.6;">• ').replace(/<\/li>/g, '</p>').replace(/<p><strong>Additional Information:<\/strong><\/p>/g, '')}
                            </div>
                            ` : ''}
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
          console.error(`Failed to send email to ${toEmail}:`, emailError);
          failedEmails.push(toEmail);
        }
      }
    }

    return NextResponse.json({
      success: true,
      sentCount,
      totalAttempted: registrations.length,
      failedEmails: failedEmails.length > 0 ? failedEmails : undefined,
    });

  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send emails' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
