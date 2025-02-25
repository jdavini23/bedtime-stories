import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Woodland Theme
        primary: {
          DEFAULT: '#3C6E71', // Forest Teal
          dark: '#2C5152',
          light: '#4F8A8D',
        },
        midnight: {
          DEFAULT: '#284B63', // Deep Blue
          dark: '#1D3649',
          light: '#345F7D',
        },
        dreamy: {
          DEFAULT: '#D9C5B2', // Warm Beige
          dark: '#C3B09E',
          light: '#E5D6C8',
        },
        golden: {
          DEFAULT: '#F2CC8F', // Honey Gold
          dark: '#E5B96E',
          light: '#F7DCAC',
        },
        cloud: {
          DEFAULT: '#F5F5F5', // Soft White
          dark: '#E8E8E8',
          light: '#FFFFFF',
        },
        // Secondary Colors
        sky: {
          DEFAULT: '#84B4C8', // Soft Sky Blue
          dark: '#6A9FB5',
          light: '#9EC8D9',
        }, 
        lavender: {
          DEFAULT: '#A5A58D', // Sage Green
          dark: '#8A8A73',
          light: '#BCBCA7',
        },
        teal: {
          DEFAULT: '#6B9080', // Forest Green
          dark: '#567568',
          light: '#7FA895',
        },
        // Text Colors
        text: {
          primary: '#FDFDFD', // Soft White
          secondary: '#353535', // Deep Charcoal
          muted: '#AAAAAA', // Pastel Grey
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['Quicksand', 'Poppins', 'sans-serif'],
        dyslexic: ['OpenDyslexic', 'Quicksand', 'sans-serif'],
      },
      fontSize: {
        'story': ['1.125rem', { lineHeight: '1.75rem' }], // 18px for story text
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'dreamy': '0 4px 14px 0 rgba(60, 110, 113, 0.2)', // Updated to match new primary color
        'glow': '0 0 15px rgba(242, 204, 143, 0.5)', // Updated to match new golden color
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'page-turn': 'pageTurn 0.6s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        pageTurn: {
          '0%': { transform: 'rotateY(0deg)', transformOrigin: 'left' },
          '100%': { transform: 'rotateY(-180deg)', transformOrigin: 'left' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
