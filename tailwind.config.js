/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          start: '#15803d', // green-700
          end: '#4ade80',   // green-400
        },
        'bg-gradient': {
          start: '#14532d', // green-900
          end: '#4ade80',   // green-400
        },
        'header-bg': '#14532d', // green-900
        blue: {
          50: '#eff6ff', // Adiciona blue-50
        },
        gray: {
          200: '#e5e7eb', // Adiciona gray-200
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #15803d, #4ade80)',
        'gradient-bg': 'linear-gradient(to right, #14532d, #4ade80)',
        'gradient-border': 'linear-gradient(to right, #15803d, #4ade80)',
      },
      keyframes: {
        scrollUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        scrollDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      animation: {
        scroll: 'scrollUp 40s linear infinite',
        'scroll-down': 'scrollDown 25s linear infinite',
      },
      fontFamily: {
        'youtube-noto': ['"YouTube Noto", Roboto, Arial, sans-serif'],
        roboto: ['Roboto, sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              fontSize: theme('fontSize.3xl'),
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.4'),
              color: theme('colors.gray.900'),
            },
            h2: {
              fontSize: theme('fontSize.2xl'),
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.3'),
              color: theme('colors.gray.800'),
            },
            h3: {
              fontSize: theme('fontSize.xl'),
              fontWeight: theme('fontWeight.semibold'),
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.2'),
              color: theme('colors.gray.700'),
            },
            ul: {
              listStyleType: 'disc',
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.4'),
              paddingLeft: theme('spacing.6'),
            },
            li: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.2'),
            },
          },
        },
        blue: {
          css: {
            '--tw-prose-headings': theme('colors.blue.800'),
            '--tw-prose-links': theme('colors.blue.600'),
            '--tw-prose-bullets': theme('colors.blue.600'),
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // Adicionado
  ],
};

