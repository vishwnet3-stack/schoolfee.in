// app/api/admin/posts/[id]/route.ts
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { unlink, writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const resolvedParams = await params as { id?: string };
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const [posts] = await db.execute<any[]>(
      `SELECT p.*, c.name as category_name 
       FROM blog_posts p
       LEFT JOIN blog_categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (!posts || posts.length === 0) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      post: posts[0],
    });
  } catch (error: any) {
    console.error('Fetch blog post error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while fetching the blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth();
    const resolvedParams = await params as { id?: string };
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }
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

    // Check if slug exists for other posts
    const [existing] = await db.execute<any[]>(
      'SELECT id FROM blog_posts WHERE slug = ? AND id != ?',
      [slug, id]
    );

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 }
      );
    }

    // Get current post for image handling
    const [currentPost] = await db.execute<any[]>(
      'SELECT featured_image FROM blog_posts WHERE id = ?',
      [id]
    );

    let imagePath = currentPost[0]?.featured_image || '';

    // Handle new image upload
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'posts');

      // Ensure upload directory exists
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        // ignore mkdir errors, writeFile will fail below if directory truly can't be created
      }

      const timestamp = Date.now();
      const originalName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${timestamp}-${originalName}`;
      const filepath = path.join(uploadDir, filename);

      await writeFile(filepath, buffer);
      
      // Delete old image if exists
      if (currentPost[0]?.featured_image) {
        try {
          const oldImagePath = path.join(process.cwd(), 'public', currentPost[0].featured_image);
          await unlink(oldImagePath);
        } catch (err) {
          // Old image doesn't exist or can't be deleted
        }
      }

      imagePath = `/uploads/posts/${filename}`;
    }

    // Set published_at if status is published and not already set
    const [postStatus] = await db.execute<any[]>(
      'SELECT status, published_at FROM blog_posts WHERE id = ?',
      [id]
    );
    
    const published_at = status === 'published' && postStatus[0]?.status !== 'published'
      ? new Date()
      : postStatus[0]?.published_at || null;

    // Update blog post
    await db.execute(
      `UPDATE blog_posts SET 
       title = ?, slug = ?, category_id = ?, author = ?, short_description = ?, 
       content = ?, featured_image = ?, featured_alt = ?, meta_title = ?, 
       meta_description = ?, primary_keyword = ?, status = ?, published_at = ?,
       updated_at = NOW()
       WHERE id = ?`,
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
        id
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
    });
  } catch (error: any) {
    console.error('Blog post update error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while updating the blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } | Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const resolvedParams = await params as { id?: string };
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    // Get post to delete image
    const [posts] = await db.execute<any[]>(
      'SELECT featured_image FROM blog_posts WHERE id = ?',
      [id]
    );

    if (posts && posts.length > 0 && posts[0].featured_image) {
      try {
        const imagePath = path.join(process.cwd(), 'public', posts[0].featured_image);
        await unlink(imagePath);
      } catch (err) {
        // Image doesn't exist or can't be deleted
      }
    }

    // Delete post
    await db.execute('DELETE FROM blog_posts WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error: any) {
    console.error('Blog post deletion error:', error);
    
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'An error occurred while deleting the blog post' },
      { status: 500 }
    );
  }
}