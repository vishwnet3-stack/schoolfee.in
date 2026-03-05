import Link from "next/link";
import { LayoutDashboard, FileText, PlusCircle, Layers } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 mb-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/admin-blog/dashboard" className="mr-6 flex items-center space-x-2">
            <LayoutDashboard className="h-5 w-5" />
            <span className="hidden font-bold sm:inline-block">
              Admin Blog
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/admin-blog/posts"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <FileText className="h-4 w-4" />
              All Posts
            </Link>
            <Link
              href="/admin-blog/posts/create"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <PlusCircle className="h-4 w-4" />
              Add Post
            </Link>
            <Link
              href="/admin-blog/categories"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <Layers className="h-4 w-4" />
              All Categories
            </Link>
            <Link
              href="/admin-blog/categories/create"
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <PlusCircle className="h-4 w-4" />
              Add Category
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}