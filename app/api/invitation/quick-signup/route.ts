// app/api/invitation/quick-signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      mobile,
      source = 'hero', // 'hero' or 'cta_bottom'
    } = body;

    // Validation
    if (!mobile) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    // Validate mobile number (Indian format)
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { error: 'Invalid mobile number. Please enter a valid 10-digit Indian mobile number' },
        { status: 400 }
      );
    }

    // Get IP address and user agent
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Check if mobile already exists in quick signups (within last 24 hours)
    const [existingSignup] = await db.execute<any[]>(
      `SELECT id FROM quick_signups 
       WHERE mobile = ? AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
       LIMIT 1`,
      [mobile]
    );

    if (existingSignup && existingSignup.length > 0) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Mobile number already registered',
          alreadyExists: true 
        }
      );
    }

    // Insert quick signup
    const [result] = await db.execute<any>(
      `INSERT INTO quick_signups (mobile, source, ip_address, user_agent) 
       VALUES (?, ?, ?, ?)`,
      [mobile, source, ipAddress, userAgent]
    );

    // Send notification email to admin (async)
    sendEmail('schoolfee.in@gmail.com', 'quickSignupNotification', {
      mobile,
      source,
    }).catch((error) => {
      console.error('Email sending error:', error);
    });

    return NextResponse.json({
      success: true,
      message: 'Mobile number saved successfully!',
      signupId: result.insertId,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Quick signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch quick signups (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = 'SELECT * FROM quick_signups WHERE 1=1';
    const params: any[] = [];

    if (source) {
      query += ' AND source = ?';
      params.push(source);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [signups] = await db.execute<any[]>(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM quick_signups WHERE 1=1';
    const countParams: any[] = [];

    if (source) {
      countQuery += ' AND source = ?';
      countParams.push(source);
    }

    const [countResult] = await db.execute<any[]>(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: signups,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });

  } catch (error: any) {
    console.error('Fetch quick signups error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching quick signups' },
      { status: 500 }
    );
  }
}