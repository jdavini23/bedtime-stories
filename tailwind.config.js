/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary))',
        golden: 'rgb(var(--golden))',
        midnight: {
          light: 'rgb(var(--midnight-light))',
          DEFAULT: 'rgb(var(--midnight))',
          dark: 'rgb(var(--midnight-dark))',
        },
      },
      borderRadius: {
        '2xl': '1rem',
      },
      backdropBlur: {
        sm: '4px',
      },
    },
  },
  plugins: [],
}
