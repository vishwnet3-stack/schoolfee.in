// app/api/admin/categories/[id]/route.ts
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    const [categories] = await db.execute<any[]>(
      'SELECT * FROM blog_categories WHERE id = ?',
      [id]
    );

    if (!categories || categories.length === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category: categories[0],
    });
  } catch (error: any) {
    console.error('Fetch category error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while fetching the category' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const { id } = await params;
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

    // Check if slug exists for other categories
    const [existing] = await db.execute<any[]>(
      'SELECT id FROM blog_categories WHERE slug = ? AND id != ?',
      [slug, id]
    );

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 400 }
      );
    }

    // Get current category for image handling
    const [currentCategory] = await db.execute<any[]>(
      'SELECT featured_image FROM blog_categories WHERE id = ?',
      [id]
    );

    let imagePath = currentCategory[0]?.featured_image || '';

    // Handle new image upload
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'categories');
      
      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}-${originalName}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      
      // Delete old image if exists
      if (currentCategory[0]?.featured_image) {
        try {
          const oldImagePath = path.join(process.cwd(), 'public', currentCategory[0].featured_image);
          await unlink(oldImagePath);
        } catch (err) {
          // Old image doesn't exist or can't be deleted
        }
      }

      imagePath = `/uploads/categories/${filename}`;
    }

    // Update category
    await db.execute(
      `UPDATE blog_categories SET 
       name = ?, slug = ?, featured_image = ?, featured_alt = ?, 
       meta_title = ?, meta_description = ?, primary_keyword = ?,
       updated_at = NOW()
       WHERE id = ?`,
      [name, slug, imagePath, featured_alt, meta_title, meta_description, primary_keyword, id]
    );

    return NextResponse.json({
      success: true,
      message: 'Category updated successfully',
    });
  } catch (error: any) {
    console.error('Category update error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while updating the category' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    // Check if category has posts
    const [posts] = await db.execute<any[]>(
      'SELECT COUNT(*) as count FROM blog_posts WHERE category_id = ?',
      [id]
    );

    if (posts[0].count > 0) {
      return NextResponse.json(
        { error: `Cannot delete category. It has ${posts[0].count} blog post(s). Please reassign or delete those posts first.` },
        { status: 400 }
      );
    }

    // Get category to delete image
    const [categories] = await db.execute<any[]>(
      'SELECT featured_image FROM blog_categories WHERE id = ?',
      [id]
    );

    if (categories && categories.length > 0 && categories[0].featured_image) {
      try {
        const imagePath = path.join(process.cwd(), 'public', categories[0].featured_image);
        await unlink(imagePath);
      } catch (err) {
        // Image doesn't exist or can't be deleted
      }
    }

    // Soft delete (set is_active to false)
    await db.execute(
      'UPDATE blog_categories SET is_active = FALSE WHERE id = ?',
      [id]
    );

    // Or hard delete if you prefer:
    // await db.execute('DELETE FROM blog_categories WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    console.error('Category deletion error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while deleting the category' },
      { status: 500 }
    );
  }
}
