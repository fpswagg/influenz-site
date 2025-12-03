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
        'dark-bg': '#0A0A0F',
        'dark-surface': '#141419',
        'dark-border': '#1F1F24',
        'violet-subtle': '#8B5CF6',
        'violet-muted': '#6D28D9',
        'text-primary': '#F5F5F7',
        'text-secondary': '#9CA3AF',
        'text-muted': '#6B7280',
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
          'base-100': '#F8F6FB',
          'base-200': '#D6D2E3',
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
  },
}

