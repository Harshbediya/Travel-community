/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#F1A501', dark: '#DF9800', light: '#F5B833' },
        secondary: '#DF6951', // coral/orange
        navy:    { DEFAULT: '#181E4B', dark: '#10153B', light: '#202863' },
        accent:  '#FF946D',
        surface: '#FFFFFF',
        muted: '#5E6282' // muted grey for text
      },
      fontFamily: {
        heading: ['Volkhov', 'serif'],
        body:    ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        card: '1.5rem',
        pill: '9999px',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      boxShadow: {
        card: '0 100px 80px rgba(0,0,0,0.02), 0 64.8148px 46.8519px rgba(0,0,0,0.0151852), 0 38.5185px 25.4815px rgba(0,0,0,0.0121481), 0 20px 13px rgba(0,0,0,0.01), 0 8.14815px 6.51852px rgba(0,0,0,0.00785185), 0 1.85185px 3.14815px rgba(0,0,0,0.00481481)',
        hover: '0 8px 40px rgba(241,165,1,0.15)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
