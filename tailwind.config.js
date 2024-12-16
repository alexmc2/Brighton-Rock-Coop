const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712',
        },
        coop: {
          50: '#f0f9f8',
          100: '#d9f2ef',
          200: '#b3e5e0',
          300: '#8cd8d1',
          400: '#66cbc2',
          500: '#40beb3',
          600: '#339890',
          700: '#26726c',
          800: '#1a4c48',
          900: '#0d2624',
        },
        violet: {
          50: '#f0f9f8',
          100: '#d9f2ef',
          200: '#b3e5e0',
          300: '#8cd8d1',
          400: '#66cbc2',
          500: '#40beb3',
          600: '#339890',
          700: '#26726c',
          800: '#1a4c48',
          900: '#0d2624',
        },
        green: {
          50: '#f0f9f8',
          100: '#d9f2ef',
          200: '#b3e5e0',
          300: '#8cd8d1',
          400: '#66cbc2',
          500: '#40beb3',
          600: '#339890',
          700: '#26726c',
          800: '#1a4c48',
          900: '#0d2624',
        },
        red: {
          50: '#FFE8E8',
          100: '#FFD1D1',
          200: '#FFB2B2',
          300: '#FF9494',
          400: '#FF7474',
          500: '#FF5656',
          600: '#FA4949',
          700: '#E63939',
          800: '#C52727',
          900: '#941818',
          950: '#600F0F',
        },
        yellow: {
          50: '#FFF2C9',
          100: '#FFE7A0',
          200: '#FFE081',
          300: '#FFD968',
          400: '#F7CD4C',
          500: '#F0BB33',
          600: '#DFAD2B',
          700: '#BC9021',
          800: '#816316',
          900: '#4F3D0E',
          950: '#342809',
        },
        sky: {
          50: '#f0f9f8',
          100: '#d9f2ef',
          200: '#b3e5e0',
          300: '#8cd8d1',
          400: '#66cbc2',
          500: '#40beb3',
          600: '#339890',
          700: '#26726c',
          800: '#1a4c48',
          900: '#0d2624',
        },
        indigo: {
          50: '#f0f9f8',
          100: '#d9f2ef',
          200: '#b3e5e0',
          300: '#8cd8d1',
          400: '#66cbc2',
          500: '#40beb3',
          600: '#339890',
          700: '#26726c',
          800: '#1a4c48',
          900: '#0d2624',
        },
      },
      boxShadow: {
        DEFAULT:
          '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.01)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.01)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      outline: {
        blue: '2px solid rgba(0, 112, 244, 0.5)',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.875rem', { lineHeight: '1.25rem' }],
        sm: ['1rem', { lineHeight: '1.5rem' }],
        base: ['1.125rem', { lineHeight: '1.75rem' }],
        lg: ['1.25rem', { lineHeight: '1.75rem' }],
        xl: ['1.5rem', { lineHeight: '2rem' }],
        '2xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '3xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '4xl': ['3rem', { lineHeight: '3rem' }],
        '5xl': ['3.75rem', { lineHeight: '3.75rem' }],
        '6xl': ['4.5rem', { lineHeight: '4.5rem' }],
      },
      screens: {
        xs: '480px',
      },
      borderWidth: {
        3: '3px',
      },
      minWidth: {
        36: '9rem',
        44: '11rem',
        56: '14rem',
        60: '15rem',
        72: '18rem',
        80: '20rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      zIndex: {
        60: '60',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'modal-appear': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'modal-appear': 'modal-appear 5s ease-out',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
    require('tailwindcss-animate'),
    require('@tailwindcss/forms'),
    plugin(({ addVariant, e }) => {
      addVariant('sidebar-expanded', ({ modifySelectors, separator }) => {
        modifySelectors(
          ({ className }) =>
            `.sidebar-expanded .${e(
              `sidebar-expanded${separator}${className}`
            )}`
        );
      });
    }),
  ],
};
