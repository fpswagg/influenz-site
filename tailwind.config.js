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
        // Light theme with purple text
        'light-bg': '#FFFFFF',
        'light-surface': '#F8F9FA',
        'light-border': '#E5E7EB',
        // Purple color palette matching the logo (darkened)
        'purple-brand': '#6D28D9',
        'purple-dark': '#581C87',
        'purple-light': '#7C3AED',
        'violet-subtle': '#6D28D9',
        'violet-muted': '#5B21B6',
        // Purple text colors (darkened)
        'text-primary': '#581C87',
        'text-secondary': '#6D28D9',
        'text-muted': '#7C3AED',
        'text-body': '#4C1D95',
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
          primary: '#6D28D9',
          secondary: '#581C87',
          accent: '#7C3AED',
          neutral: '#4C1D95',
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

