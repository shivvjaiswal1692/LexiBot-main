/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        blue: {
          25:  '#f5f9ff',
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        sky: {
          50:  '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        slate: {
          50:  '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.35s ease-out',
        'pulse-slow': 'pulse 2.5s ease-in-out infinite',
        'shimmer':    'shimmer 1.5s linear infinite',
        'bounce-dot': 'bounceDot 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        bounceDot: { '0%,80%,100%': { transform: 'scale(0.6)', opacity: '0.4' }, '40%': { transform: 'scale(1)', opacity: '1' } },
      },
      boxShadow: {
        'blue-sm': '0 1px 3px 0 rgba(37,99,235,0.08), 0 1px 2px -1px rgba(37,99,235,0.06)',
        'blue-md': '0 4px 16px -2px rgba(37,99,235,0.12), 0 2px 8px -2px rgba(37,99,235,0.08)',
        'card':    '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};
