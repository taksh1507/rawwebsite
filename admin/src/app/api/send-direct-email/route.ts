import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Function to generate email body using different templates
function generateEmailBody(message: string, templateType: string = 'custom'): string {
  const signature = `

Best Regards,

Team RAW
Robotics and Automation Wing
St. Francis Institute of Technology
Room 027, SFIT, Borivali West, Mumbai 400103

Email: teamraw@sfit.ac.in
Website: https://rawwebsite-seven.vercel.app
Instagram: https://www.instagram.com/teamraw_sfit
LinkedIn: https://www.linkedin.com/company/team-raw-sfit`;

  const quickSignature = `

Best Regards,

Team RAW
Robotics and Automation Wing
St. Francis Institute of Technology
Mumbai

Email: teamraw@sfit.ac.in
Website: https://rawwebsite-seven.vercel.app
Instagram: https://www.instagram.com/teamraw_sfit
LinkedIn: https://www.linkedin.com/company/team-raw-sfit`;

  const header = `-----------------------------------------------------------
TEAM RAW - ROBOTICS AND AUTOMATION WING
St. Francis Institute of Technology, Mumbai
-----------------------------------------------------------

`;

  const footer = `

-----------------------------------------------------------`;

  switch (templateType) {
    case 'inquiry':
      return header + `Thank you for reaching out to Team RAW - Robotics and Automation Wing at St. Francis Institute of Technology.

${message}

If you have any further questions or would like to discuss this in more detail, please feel free to contact us.` + signature + footer;
    
    case 'collaboration':
      return header + `Team RAW - Robotics and Automation Wing at St. Francis Institute of Technology, Mumbai, would like to explore collaboration opportunities with your organization.

${message}

We believe this partnership would be mutually beneficial and look forward to discussing this further.

Please let us know your availability for a meeting or call.` + signature + footer;
    
    case 'licensing':
      return header + `Thank you for your interest in Team RAW's code repository.

Our code is released under a proprietary license with the following key terms:
- Viewing and reference purposes only
- No copying, reproduction, or distribution without written permission
- Educational institutions may reference with proper attribution
- Commercial use requires a separate license agreement

${message}

For formal licensing inquiries, please provide details about your intended use and we will review your request.` + signature + footer;
    
    case 'event':
      return header + `Team RAW - Robotics and Automation Wing at St. Francis Institute of Technology is pleased to invite you to our event.

${message}

We look forward to your participation.` + signature + footer;
    
    case 'recruitment':
      return header + `Team RAW - Robotics and Automation Wing at St. Francis Institute of Technology, Mumbai.

${message}

For more information or to join our team, please visit our workspace at Room 027, SFIT, Borivali West, or contact us via email.` + signature + footer;
    
    case 'quick':
      return header + message + quickSignature + footer;
    
    default: // custom
      return header + message + signature + footer;
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let recipients, subject, message, templateType, attachments;

    // Handle both JSON and FormData requests
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      recipients = JSON.parse(formData.get('recipients') as string || '[]');
      subject = formData.get('subject') as string;
      message = formData.get('message') as string;
      templateType = formData.get('templateType') as string;
      
      // Process multiple attachments
      attachments = [];
      const files = formData.getAll('attachments');
      
      for (const file of files) {
        if (file instanceof File) {
          // Check file size (max 25MB per file - Gmail limit)
          if (file.size > 25 * 1024 * 1024) {
            return NextResponse.json(
              { success: false, error: `File ${file.name} exceeds 25MB limit` },
              { status: 400 }
            );
          }
          
          const buffer = Buffer.from(await file.arrayBuffer());
          attachments.push({
            filename: file.name,
            content: buffer,
            contentType: file.type,
          });
        }
      }
    } else {
      const body = await request.json();
      recipients = body.recipients;
      subject = body.subject;
      message = body.message;
      templateType = body.templateType;
      attachments = body.attachments || [];
    }

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
        const mailOptions: any = {
          from: {
            name: 'Team RAW - SFIT',
            address: process.env.EMAIL_USER,
          },
          to: recipientEmail,
          subject: subject,
          text: generateEmailBody(message, templateType || 'custom'),
        };

        // Add attachments if present
        if (attachments && attachments.length > 0) {
          mailOptions.attachments = attachments;
        }

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
