/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#004f80',
          light: '#7191b7',
          dark: '#0d2d52',
        },
        secondary: {
          DEFAULT: '#7191b7',
          light: '#bcc9de',
          dark: '#5f6582',
        },
        accent: {
          DEFAULT: '#4ac7e9',
          light: '#8dc8d9',
          medium: '#77d0ed',
          lighter: '#dcf1f9',
        },
        highlight: '#ffaa0c',
        success: '#67cc34',
        error: '#e8506e',
        dark: {
          1: '#0d2d52',
          2: '#5f6582',
        },
        gray: {
          1: '#d8d8df',
        },
        tint: {
          20: '#d9dfec',
          50: '#bcc9de',
        }
      },
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}