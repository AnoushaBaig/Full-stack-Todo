'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthGuard } from '../../lib/auth-guard';
import { jwtStorage } from '../../lib/jwt-storage';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // For now, simulate Better Auth signup
      // In a real implementation, we would use Better Auth client
      // For demo purposes, let's call the backend signup endpoint directly
      const response = await fetch('http://localhost:8000/auth/signup', {
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

          // Redirect to signin after successful signup
          setSuccessMessage('Account created successfully! Redirecting to sign in...');
          setTimeout(() => {
            router.push('/signin');
          }, 2000);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || 'Signup failed');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-sky-50 dark:bg-slate-900 p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 space-y-6 border border-slate-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-6xl mb-4">📝</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">Create Account</h1>
            <p className="mt-2 text-sky-600 dark:text-sky-300">
              Join us to manage your tasks
            </p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-xl dark:bg-red-900 dark:text-red-100 shadow-md">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 text-green-700 p-4 rounded-xl dark:bg-green-900 dark:text-green-100 shadow-md">
              {successMessage}
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-sky-700 dark:text-sky-300 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="text-center text-sm text-sky-600 dark:text-sky-400 pt-2">
            Already have an account?{' '}
            <Link href="/signin" className="text-sky-600 hover:underline font-medium dark:text-sky-400 hover:text-sky-700 transition-colors duration-200">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}