// JWT Storage Utility
// Handles storing, retrieving, and removing JWT tokens from localStorage

const TOKEN_KEY = 'better-auth-jwt';

export const jwtStorage = {
  /**
   * Store JWT token in localStorage
   */
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  /**
   * Retrieve JWT token from localStorage
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  /**
   * Remove JWT token from localStorage
   */
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  /**
   * Clear JWT token from localStorage (alias for removeToken)
   */
  clearToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  /**
   * Check if a valid token exists
   */
  hasToken: (): boolean => {
    const token = jwtStorage.getToken();
    return token !== null && token.length > 0;
  },

  /**
   * Decode JWT payload to check expiration (without verification)
   */
  isTokenExpired: (token?: string): boolean => {
    const tokenToCheck = token || jwtStorage.getToken();
    if (!tokenToCheck) {
      return true;
    }

    try {
      const parts = tokenToCheck.split('.');
      if (parts.length !== 3) {
        return true; // Invalid JWT format
      }

      const payload = parts[1];
      const decodedPayload = atob(payload);
      const parsedPayload = JSON.parse(decodedPayload);

      // Check if token is expired based on exp claim
      const currentTime = Math.floor(Date.now() / 1000);
      return parsedPayload.exp && parsedPayload.exp < currentTime;
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return true; // Consider token as expired if there's an error
    }
  }
};