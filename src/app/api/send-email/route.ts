import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, html, from } = await request.json();

    // Validate required fields
    if (!to || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject' },
        { status: 400 }
      );
    }

    const sendGridApiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = from || {
      email: process.env.SENDGRID_EMAIL,
      name: 'Workflow Automation'
    };

    const sendGridBody = {
      personalizations: [
        {
          to: Array.isArray(to) ? to : [{ email: to }],
          subject: subject,
        },
      ],
      from: typeof fromEmail === 'string' ? { email: fromEmail } : fromEmail,
      content: [
        {
          type: 'text/html',
          value: html || '<p>No content provided</p>',
        },
      ],
    };

    console.log('📤 Sending email via SendGrid:', {
      to: sendGridBody.personalizations[0].to,
      subject,
      from: sendGridBody.from,
    });

    // Call SendGrid API from server
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sendGridApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendGridBody),
    });

    console.log('📥 SendGrid Response Status:', response.status);

    // SendGrid returns 202 on success
    if (response.status === 202) {
      return NextResponse.json({
        success: true,
        message: 'Email queued for sending',
        status: response.status,
      });
    }

    // Handle errors
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = await response.text();
    }

    console.error('❌ SendGrid Error:', errorData);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send email',
        details: errorData,
        status: response.status,
      },
      { status: response.status }
    );
  } catch (error: any) {
    console.error('❌ Server Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}