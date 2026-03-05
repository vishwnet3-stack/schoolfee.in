// app/api/admin/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const formData = await request.formData();

    const name = formData.get('name') as string;
    const slug = formData.get('slug') as string;
    const featured_alt = formData.get('featured_alt') as string || '';
    const meta_title = formData.get('meta_title') as string || '';
    const meta_description = formData.get('meta_description') as string || '';
    const primary_keyword = formData.get('primary_keyword') as string || '';
    const imageFile = formData.get('featured_image') as File | null;

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const [existing] = await db.execute<any[]>(
      'SELECT id FROM blog_categories WHERE slug = ?',
      [slug]
    );

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    // Handle image upload
    let imagePath = '';
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'categories');
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
      imagePath = `/uploads/categories/${filename}`;
    }

    // Insert category
    const [result] = await db.execute<any>(
      `INSERT INTO blog_categories 
       (name, slug, featured_image, featured_alt, meta_title, meta_description, primary_keyword, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, imagePath, featured_alt, meta_title, meta_description, primary_keyword, user.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Category created successfully',
      categoryId: result.insertId,
    });
  } catch (error: any) {
    console.error('Category creation error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while creating the category' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const [categories] = await db.execute<any[]>(
      `SELECT c.*, u.username as created_by_name 
       FROM blog_categories c
       LEFT JOIN admin_users u ON c.created_by = u.id
       WHERE c.is_active = TRUE
       ORDER BY c.created_at DESC`
    );

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error: any) {
    console.error('Fetch categories error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while fetching categories' },
      { status: 500 }
    );
  }
}