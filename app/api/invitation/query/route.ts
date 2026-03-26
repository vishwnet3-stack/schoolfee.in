// app/api/invitation/query/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { query, email } = body;

    // Validation
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query message is required' },
        { status: 400 }
      );
    }

    if (query.trim().length < 10) {
      return NextResponse.json(
        { error: 'Query message must be at least 10 characters' },
        { status: 400 }
      );
    }

    if (query.length > 5000) {
      return NextResponse.json(
        { error: 'Query message is too long. Maximum 5000 characters allowed.' },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Get IP address and user agent for tracking (optional)
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // ✅ NO RATE LIMITING - Users can submit multiple queries

    // Insert query with email
    const [result] = await db.execute<any>(
      `INSERT INTO contact_queries (query_text, email, ip_address, user_agent) 
       VALUES (?, ?, ?, ?)`,
      [query.trim(), email?.trim() || null, ipAddress, userAgent]
    );

    // Send emails asynchronously
    Promise.all([
      // Send confirmation email to USER (if email provided)
      email ? sendEmail(email, 'queryConfirmation', {
        query: query.trim(),
      }) : Promise.resolve(),
      
      // Send notification to ADMIN
      sendEmail('schoolfee.in@gmail.com', 'queryNotificationWithEmail', {
        query: query.trim(),
        email: email || 'Not provided',
      }),
    ]).catch((error) => {
      console.error('Email sending error:', error);
    });

    return NextResponse.json({
      success: true,
      message: email 
        ? 'Your query has been submitted successfully. We will contact you within 2 working days. Check your email for confirmation.'
        : 'Your query has been submitted successfully. We will review it within 2 working days.',
      queryId: result.insertId,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Query submission error:', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting your query. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch queries (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = 'SELECT * FROM contact_queries WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [queries] = await db.execute<any[]>(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM contact_queries WHERE 1=1';
    const countParams: any[] = [];

    if (status) {
      countQuery += ' AND status = ?';
      countParams.push(status);
    }

    const [countResult] = await db.execute<any[]>(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: queries,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });

  } catch (error: any) {
    console.error('Fetch queries error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching queries' },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update query status (for admin)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { queryId, status, adminNotes } = body;

    if (!queryId) {
      return NextResponse.json(
        { error: 'Query ID is required' },
        { status: 400 }
      );
    }

    const validStatuses = ['new', 'in_progress', 'resolved', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Build update query
    const updates: string[] = [];
    const params: any[] = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }

    if (adminNotes !== undefined) {
      updates.push('admin_notes = ?');
      params.push(adminNotes);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 }
      );
    }

    params.push(queryId);

    await db.execute(
      `UPDATE contact_queries SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`,
      params
    );

    return NextResponse.json({
      success: true,
      message: 'Query updated successfully',
    });

  } catch (error: any) {
    console.error('Update query error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the query' },
      { status: 500 }
    );
  }
}