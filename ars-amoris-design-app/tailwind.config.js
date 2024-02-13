/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'slide-in': {
          '0%': {
            transform: 'translateX(-50px)',
            opacity: '50%'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '100%'
          },
        },
        'pop-in': {
          from: {
            opacity: 0.5
          },
          to: {
            opacity: 1
          }
        }
      },
      animation: {
        'slide-in': 'slide-in .6s ease-in',
        'pop-in': 'pop-in .7s ease-in',
        'slide-in-then-pulse': 'slide-in .6s ease-in, pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    },
  },
  plugins: [],
}