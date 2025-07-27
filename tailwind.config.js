/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'linkedin': '#0077B5',
        'linkedin-hover': '#005885',
        'aifluence': {
          '50': '#eff8ff',
          '100': '#dbeefe',
          '200': '#bfe2fe',
          '300': '#93d0fd',
          '400': '#60b4fa',
          '500': '#3b97f6',
          '600': '#1497ff',
          '700': '#0c6adf',
          '800': '#1155b5',
          '900': '#154a8e'
        },
        'dark': {
          'primary': '#1a1a1a',
          'secondary': '#0f0f0f',
          'panel': '#1e1e1e',
          'border': '#2a2a2a',
          'accent': '#6366f1',
          'text': '#e5e5e5',
          'text-muted': '#a0a0a0'
        }
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}