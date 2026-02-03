// utils/theme.ts

export const getPreferredTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      return savedTheme;
    }

    // Check for system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return systemPrefersDark ? 'dark' : 'light';
  }

  // Default to light theme on the server
  return 'light';
};

export const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof document !== 'undefined') {
    // Remove existing theme classes
    document.documentElement.classList.remove('light', 'dark');

    // Apply new theme class
    document.documentElement.classList.add(theme);

    // Update meta theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? '#0f172a' : '#f8fafc'
      );
    }
  }
};