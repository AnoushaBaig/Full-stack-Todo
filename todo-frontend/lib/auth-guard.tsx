'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtStorage } from './jwt-storage';

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean; // If true, requires auth; if false, redirects away if authenticated
}

/**
 * Client-side authentication guard component
 * Protects routes based on authentication status
 */
export function AuthGuard({
  children,
  redirectTo = '/signin',
  requireAuth = true
}: AuthGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = jwtStorage.hasToken() && !jwtStorage.isTokenExpired();

      if (requireAuth && !isAuthenticated) {
        // User needs to be authenticated but is not, redirect to signin
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        // User should not be authenticated but is, redirect away (e.g., from signin/signup to todos)
        router.push('/todos');
      }

      setLoading(false);
    };

    checkAuth();
  }, [requireAuth, redirectTo, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}

/**
 * Custom hook to check authentication status
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const tokenExists = jwtStorage.hasToken();
      const tokenNotExpired = !jwtStorage.isTokenExpired();

      setIsAuthenticated(tokenExists && tokenNotExpired);
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes in case token is removed from another tab
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { isAuthenticated, loading };
}