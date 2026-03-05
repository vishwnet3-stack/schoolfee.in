// app/api/public/categories/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    console.log('Fetching public categories...');

    const [categories] = await db.execute<any[]>(
      `SELECT 
        id, 
        name, 
        slug, 
        featured_image, 
        featured_alt, 
        meta_description
       FROM blog_categories 
       WHERE is_active = TRUE 
       ORDER BY name ASC`
    );

    console.log('Categories fetched:', categories?.length || 0);

    return NextResponse.json({
      success: true,
      categories: categories || [],
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error: any) {
    console.error('Error fetching public categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch categories',
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