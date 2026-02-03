'use client';

import React from 'react';
import Link from 'next/link';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  asLink?: boolean;
  href?: string;
  children: React.ReactNode;
}

export default function PleasantButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  asLink = false,
  href,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-xl hover-lift focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-xl font-medium';

  const variants = {
    primary: 'bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white focus:ring-sky-500',
    secondary: 'bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-slate-700 dark:to-slate-600 hover:from-sky-200 hover:to-indigo-200 dark:hover:from-slate-600 dark:hover:to-slate-500 text-sky-700 dark:text-sky-300 focus:ring-sky-500',
    success: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white focus:ring-emerald-500',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-sky-100 dark:hover:bg-slate-700 text-sky-600 dark:text-sky-400 focus:ring-sky-500'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const combinedClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

  if (asLink && href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}