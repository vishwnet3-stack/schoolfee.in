// app/api/public/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const exclude = searchParams.get('exclude');

    let query = `
      SELECT 
        p.id,
        p.title,
        p.slug,
        p.short_description,
        p.featured_image,
        p.featured_alt,
        p.author,
        p.created_at,
        c.name as category_name,
        c.slug as category_slug
      FROM blog_posts p
      LEFT JOIN blog_categories c ON p.category_id = c.id
      WHERE p.status = 'published'
    `;

    const params: any[] = [];

    if (category) {
      query += ` AND c.slug = ?`;
      params.push(category);
    }

    if (exclude) {
      query += ` AND p.id != ?`;
      params.push(parseInt(exclude));
    }

    query += ` ORDER BY p.created_at DESC`;

    if (limit) {
      query += ` LIMIT ?`;
      params.push(parseInt(limit));
    }

    console.log('Executing query:', query);
    console.log('With params:', params);

    const [posts] = await db.execute<any[]>(query, params);

    console.log('Posts fetched:', posts?.length || 0);

    return NextResponse.json({
      success: true,
      posts: posts || [],
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error: any) {
    console.error('Error fetching public posts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch posts',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Add OPTIONS for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}