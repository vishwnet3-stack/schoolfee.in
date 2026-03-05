// proxy.ts (root file)

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Trigger startup logic (migrations, etc.)
import './lib/startup';

export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
