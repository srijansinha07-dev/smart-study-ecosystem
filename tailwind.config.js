/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        void: '#05050f',
        surface: '#0d0d1f',
        panel: '#111128',
        border: '#1e1e3a',
        accent: {
          DEFAULT: '#7c6fff',
          soft: '#a594ff',
          glow: '#5a4fcf',
        },
        ember: '#ff6b6b',
        jade: '#4ecdc4',
        gold: '#ffd93d',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh': 'radial-gradient(at 40% 20%, hsla(255,80%,60%,0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(190,70%,50%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(340,60%,50%,0.08) 0px, transparent 50%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      backdropBlur: { xs: '2px' },
      boxShadow: {
        'glow': '0 0 30px rgba(124, 111, 255, 0.3)',
        'glow-sm': '0 0 15px rgba(124, 111, 255, 0.2)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.05)',
      }
    },
  },
  plugins: [],
}
