// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyCredentials, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    console.log('Admin login attempt for username:', username);

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Verify credentials (checks env fallback first, then DB)
    console.log('Verifying credentials for:', username);
    const user = await verifyCredentials(username, password);
    console.log('Credentials verification result:', user ? 'Success' : 'Failed');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create session
    console.log('Creating session for user:', user.username);
    await createSession(user.id);

    console.log('Admin login successful for:', username);
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}