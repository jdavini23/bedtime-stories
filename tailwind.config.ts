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
        // Primary Colors
        primary: {
          DEFAULT: '#7B3F92', // Magical Purple
          dark: '#6A3480',
          light: '#9355A8',
        },
        midnight: {
          DEFAULT: '#1A2A6C', // Midnight Blue
          dark: '#15225A',
          light: '#2C3E85',
        },
        dreamy: {
          DEFAULT: '#FF85A1', // Dreamy Pink
          dark: '#FF6B8E',
          light: '#FFA0B5',
        },
        golden: {
          DEFAULT: '#FFC75F', // Golden Glow
          dark: '#FFBB42',
          light: '#FFD47F',
        },
        cloud: {
          DEFAULT: '#FAFAFA', // Cloud White
          dark: '#F0F0F0',
          light: '#FFFFFF',
        },
        // Secondary Colors
        sky: {
          DEFAULT: '#00A6FB', // Sky Blue
          dark: '#0095E2',
          light: '#33B5FC',
        }, 
        lavender: {
          DEFAULT: '#C3B1E1', // Soft Lavender
          dark: '#B49FD8',
          light: '#D2C4E9',
        },
        teal: {
          DEFAULT: '#A3E4DB', // Misty Teal
          dark: '#8DDDCF',
          light: '#B9ECE5',
        },
        // Text Colors
        text: {
          primary: '#FDFDFD', // Soft White
          secondary: '#333333', // Deep Charcoal
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
        'dreamy': '0 4px 14px 0 rgba(123, 63, 146, 0.2)',
        'glow': '0 0 15px rgba(255, 199, 95, 0.5)',
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
