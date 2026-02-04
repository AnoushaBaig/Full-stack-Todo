'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '../../lib/auth-guard';
import { jwtStorage } from '../../lib/jwt-storage';

export default function SigninPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      // Get API URL from environment variable
      const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!API_URL) {
        throw new Error('API URL is not configured');
      }

      // Call the backend signin endpoint
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        // Store the JWT token received from backend
        if (data.token) {
          jwtStorage.setToken(data.token);

          // Redirect to todos after successful signin
          router.push('/todos');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Invalid credentials');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Signin error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-slate-900 p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-6 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">Welcome Back</h1>
            <p className="mt-2 text-sky-600 dark:text-sky-300">
              Sign in to your account
            </p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-xl dark:bg-red-900 dark:text-red-100 shadow-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-sky-700 dark:text-sky-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-5 py-4 border-2 border-sky-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-sky-300 focus:border-sky-500 dark:bg-slate-700 dark:text-white disabled:opacity-50 transition-all duration-300 shadow-sm"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-sky-700 dark:text-sky-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-5 py-4 border-2 border-sky-200 dark:border-slate-600 rounded-2xl focus:ring-4 focus:ring-sky-300 focus:border-sky-500 dark:bg-slate-700 dark:text-white disabled:opacity-50 transition-all duration-300 shadow-sm"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold py-4 px-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="text-center text-sm text-sky-600 dark:text-sky-400 pt-2">
            Don't have an account?{' '}
            <Link href="/signup" className="text-sky-600 hover:underline font-medium dark:text-sky-400 hover:text-sky-700 transition-colors duration-200">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}