/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0A0B10',
          surface: '#12141C',
          surface2: '#1A1D28',
          line: '#262A38',
        },
        paper: {
          DEFAULT: '#F7F7FA',
          surface: '#FFFFFF',
          line: '#E4E5EC',
        },
        signal: {
          DEFAULT: '#6E56CF',
          50: '#F1EEFC',
          100: '#E3DCFA',
          300: '#B3A1EC',
          500: '#6E56CF',
          600: '#5A44B8',
          700: '#46339A',
        },
        cyan: {
          DEFAULT: '#33C3F0',
        },
        mint: {
          DEFAULT: '#34D399',
        },
        amber: {
          DEFAULT: '#F5B94D',
        },
        coral: {
          DEFAULT: '#F16B6B',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-dark':
          'linear-gradient(to right, #1A1D28 1px, transparent 1px), linear-gradient(to bottom, #1A1D28 1px, transparent 1px)',
        'grid-light':
          'linear-gradient(to right, #ECEDF3 1px, transparent 1px), linear-gradient(to bottom, #ECEDF3 1px, transparent 1px)',
        'signal-gradient': 'linear-gradient(135deg, #6E56CF 0%, #33C3F0 100%)',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        blink: 'blink 1s step-start infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.4s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
