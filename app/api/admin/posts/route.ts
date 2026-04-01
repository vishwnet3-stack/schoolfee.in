// app/api/admin/posts/route.ts
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const category_id = formData.get('category_id') as string;
    const author = formData.get('author') as string || 'Admin';
    const short_description = formData.get('short_description') as string || '';
    const content = formData.get('content') as string;
    const featured_alt = formData.get('featured_alt') as string || '';
    const meta_title = formData.get('meta_title') as string || '';
    const meta_description = formData.get('meta_description') as string || '';
    const primary_keyword = formData.get('primary_keyword') as string || '';
    const status = formData.get('status') as string || 'draft';
    const imageFile = formData.get('featured_image') as File | null;

    // Validate required fields
    if (!title || !slug || !content || !category_id) {
      return NextResponse.json(
        { error: 'Title, slug, content, and category are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const [existing] = await db.execute<any[]>(
      'SELECT id FROM blog_posts WHERE slug = ?',
      [slug]
    );

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 }
      );
    }

    // Handle image upload
    let imagePath = '';
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'posts');
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        // Directory already exists
      }

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}-${originalName}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      imagePath = `/uploads/posts/${filename}`;
    }

    // Set published_at if status is published
    const published_at = status === 'published' ? new Date() : null;

    // Insert blog post
    const [result] = await db.execute<any>(
      `INSERT INTO blog_posts 
       (title, slug, category_id, author, short_description, content, featured_image, featured_alt, 
        meta_title, meta_description, primary_keyword, status, published_at, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, 
        slug, 
        category_id, 
        author, 
        short_description, 
        content, 
        imagePath, 
        featured_alt, 
        meta_title, 
        meta_description, 
        primary_keyword, 
        status, 
        published_at, 
        user.id
      ]
    );

    return NextResponse.json({
      success: true,
      message: status === 'published' ? 'Blog post published successfully' : 'Blog post saved as draft',
      postId: result.insertId,
    });
  } catch (error: any) {
    console.error('Blog post creation error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while creating the blog post' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = `
      SELECT p.*, c.name as category_name, u.username as created_by_name 
      FROM blog_posts p
      LEFT JOIN blog_categories c ON p.category_id = c.id
      LEFT JOIN admin_users u ON p.created_by = u.id
    `;

    const params: any[] = [];

    if (status) {
      query += ' WHERE p.status = ?';
      params.push(status);
    }

    query += ' ORDER BY p.created_at DESC';

    const [posts] = await db.execute<any[]>(query, params);

    return NextResponse.json({
      success: true,
      posts,
    });
  } catch (error: any) {
    console.error('Fetch blog posts error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while fetching blog posts' },
      { status: 500 }
    );
  }
}