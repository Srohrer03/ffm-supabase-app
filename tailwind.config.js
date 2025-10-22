/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1d4ed8', // blue-700
        cfs: {
          blue: '#0057B8',
          light: '#6EC1E4',
          dark: '#003F7F',
          navy: '#0A2540'
        },
        neutral: {
          bg: '#F7F9FC',
          card: '#FFFFFF',
          text: {
            primary: '#1F2937',
            secondary: '#6B7280'
          }
        },
        status: {
          success: '#16A34A',
          warning: '#FACC15',
          danger: '#DC2626'
        }
      },
    },
  },
  plugins: [],
};
