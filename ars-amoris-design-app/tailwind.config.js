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
            opacity: '0%'
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '100%'
          },
        }
      },
      animation: {
        'slide-in': 'slide-in .6s ease-in'
      }
    },
  },
  plugins: [],
}