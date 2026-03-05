// app/admin-blog/login/page.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  // Check if already logged in
  const user = await getSession();
  
  if (user) {
    redirect('/admin-blog/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Login
            </h1>
            <p className="text-gray-600">
              Sign in to access your dashboard
            </p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Forgot your password?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Contact support
              </a>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-white/70">
          <p>© 2025 Your Blog. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}