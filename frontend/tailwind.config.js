/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#6ee7b7', // Soft Emerald 300
          DEFAULT: '#10b981', // Emerald 500 - Professional Green
          dark: '#047857', // Emerald 700
        },
        accent: {
          light: '#fde68a', // Amber 200 - Soft Gold highlight
          DEFAULT: '#d97706', // Amber 600 - Muted Gold
          dark: '#b45309', // Amber 700
        },
        background: '#f4f7f6', // Soft cool off-white for page background
        surface: '#ffffff', // Pure white for cards
        success: '#10b981', // Match brand
        error: '#f43f5e', // Soft Rose
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(16, 185, 129, 0.05)',
        'neu-flat': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)', // Cleaner, softer elevation
        'neu-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', // Lifted state
        'neu-pressed': 'inset 2px 2px 5px #e2e4e7, inset -2px -2px 5px #ffffff',
        'neu-light': '0 1px 2px rgba(0, 0, 0, 0.05)', // Very subtle
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};

