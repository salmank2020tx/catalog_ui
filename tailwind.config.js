/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        confidence: {
          high: '#22c55e',
          medium: '#eab308',
          low: '#ef4444',
        },
        emerald: {
          50: '#e6f4ec',
          100: '#cce9da',
          200: '#99d2b5',
          300: '#66bc90',
          400: '#33a66b',
          500: '#009043',
          600: '#00823c',
          700: '#006c32',
          800: '#005628',
          900: '#003a1b',
        },
        red: {
          50: '#fef2f3',
          100: '#fde5e7',
          200: '#fbcacf',
          300: '#f8a0a7',
          400: '#f45b67',
          500: '#f00023',
          600: '#d8001f',
          700: '#b4001a',
          800: '#900015',
          900: '#60000e',
        },
      },
    },
  },
  plugins: [],
};