import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import fs from 'fs'
import path from 'path'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://schoolfee.in'

// Add folder names here to hide those pages from the sitemap
const EXCLUDE_PAGES = new Set([
  'login',
  'profile',
  'digilocker-callback',
  'not-found',
  'beyond-school',
  'digilocker-parent-callback',
  'digilocker-teacher-callback',
  'funding',
  'impact',
  'story', 
  'story/impact',
  'story/mission',
])

function discoverPages(websiteDir: string): string[] {
  const pages: string[] = []

  function walk(dir: string, route: string) {
    let items: fs.Dirent[]
    try { items = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }

    const segments  = route.split('/').filter(Boolean)
    const isDynamic = segments.some(s => /^\[.+\]$/.test(s))
    const isExcluded = segments.some(s => EXCLUDE_PAGES.has(s))

    if (items.some(f => f.isFile() && f.name === 'page.tsx') && !isDynamic && !isExcluded) {
      pages.push(route || '/')
    }

    for (const item of items) {
      if (!item.isDirectory()) continue
      if (item.name.startsWith('_') || item.name.startsWith('.')) continue
      const isGroup = /^\(.+\)$/.test(item.name)
      if (!isGroup && /^[A-Z]/.test(item.name)) continue
      walk(path.join(dir, item.name), route + (isGroup ? '' : `/${item.name}`))
    }
  }

  walk(websiteDir, '')
  return [...new Set(pages)].sort()
}

// Check if a column exists in a table
async function columnExists(table: string, column: string): Promise<boolean> {
  try {
    const [rows] = await db.execute<any[]>(
      `SELECT COUNT(*) as cnt FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [table, column]
    )
    return rows[0]?.cnt > 0
  } catch {
    return false
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // Static pages — auto-discovered from filesystem. Add/delete a page folder and it
  // reflects here on next request with no code changes needed.
  const pageEntries: MetadataRoute.Sitemap = discoverPages(
    path.join(process.cwd(), 'app', '(website)')
  ).map(route => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Blog posts — fetched live from DB every request
  let postEntries: MetadataRoute.Sitemap = []
  try {
    // Check if the exclude_from_sitemap column exists (added via migration 015)
    const hasExcludeCol = await columnExists('blog_posts', 'exclude_from_sitemap')

    const query = hasExcludeCol
      ? `SELECT slug, updated_at, created_at FROM blog_posts
         WHERE status = 'published' AND exclude_from_sitemap = 0
         ORDER BY created_at DESC`
      : `SELECT slug, updated_at, created_at FROM blog_posts
         WHERE status = 'published'
         ORDER BY created_at DESC`

    const [posts] = await db.execute<any[]>(query)

    postEntries = (posts || []).map((p: any) => ({
      url: `${BASE_URL}/blogs/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(p.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }))
  } catch (err) {
    console.error('[sitemap] failed to fetch blog posts:', err)
  }

  return [...pageEntries, ...postEntries]
}