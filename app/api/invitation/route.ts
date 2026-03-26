// app/api/invitation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      role,
      name,
      city,
      mobile,
      email,
      optIn = false,
      source = 'modal',
    } = body;

    // Validation
    if (!role || !name || !city || !mobile || !email) {
      return NextResponse.json(
        { error: 'All fields are required' },
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

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check for duplicate registration (same mobile or email)
    const [existing] = await db.execute<any[]>(
      'SELECT id, mobile, email FROM invitation_registrations WHERE mobile = ? OR email = ? LIMIT 1',
      [mobile, email]
    );

    if (existing && existing.length > 0) {
      const duplicate = existing[0];
      if (duplicate.mobile === mobile && duplicate.email === email) {
        return NextResponse.json(
          { error: 'You have already registered with this mobile number and email' },
          { status: 409 }
        );
      } else if (duplicate.mobile === mobile) {
        return NextResponse.json(
          { error: 'This mobile number is already registered' },
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          { error: 'This email is already registered' },
          { status: 409 }
        );
      }
    }

    // Get IP address and user agent
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Insert registration
    const [result] = await db.execute<any>(
      `INSERT INTO invitation_registrations 
       (role, name, city, mobile, email, opt_in, source, ip_address, user_agent) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [role, name, city, mobile, email, optIn, source, ipAddress, userAgent]
    );

    // ✅ FIXED: Send emails SEPARATELY to avoid admin receiving user emails
    // Send welcome email to USER ONLY
    sendEmail(email, 'userWelcome', { 
      name, 
      role 
    }).catch((error) => {
      console.error('User welcome email error:', error);
    });

    // Send notification to ADMIN ONLY (separate call)
    sendEmail('schoolfee.in@gmail.com', 'adminNotification', {
      name,
      role,
      mobile,
      email,
      city,
    }).catch((error) => {
      console.error('Admin notification email error:', error);
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful! Check your email for confirmation.',
      registrationId: result.insertId,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch all registrations (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = 'SELECT * FROM invitation_registrations WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [registrations] = await db.execute<any[]>(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM invitation_registrations WHERE 1=1';
    const countParams: any[] = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    if (role) {
      countQuery += ' AND role = ?';
      countParams.push(role);
    }

    const [countResult] = await db.execute<any[]>(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: registrations,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });

  } catch (error: any) {
    console.error('Fetch registrations error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching registrations' },
      { status: 500 }
    );
  }
}