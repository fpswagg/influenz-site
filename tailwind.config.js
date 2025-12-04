/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        'light-bg': '#FFFFFF',
        'light-surface': '#F8F9FA',
        'light-border': '#E5E7EB',
        'violet-subtle': '#8B5CF6',
        'violet-muted': '#6D28D9',
        'text-primary': '#1F2937',
        'text-secondary': '#4B5563',
        'text-muted': '#9CA3AF',
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'hero': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
      },
      maxWidth: {
        'content': '1400px',
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        influenz: {
          primary: '#6A0DAD',
          secondary: '#3A0D4A',
          accent: '#C79BFF',
          neutral: '#1A0C20',
          'base-100': '#FFFFFF',
          'base-200': '#F8F9FA',
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
  },
}

