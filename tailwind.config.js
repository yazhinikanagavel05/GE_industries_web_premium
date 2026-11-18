/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steel: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        brand: {
          navy: '#102650',        // Deep navy blue (Brochure primary)
          royal: '#1D4F91',       // Royal blue (Accent secondary)
          accent: '#1685F8',      // Electric blue accent (Interactive highlights)
          light: '#F3F5F8',       // Soft background grey
          charcoal: '#222831',    // Industrial Charcoal
          steel: '#8A929E',       // Steel grey
          dark: '#081225',        // Ultra dark luxury industrial navy
          surface: '#122344',     // Card surface in dark sections
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        kenburns: {
          '0%': { transform: 'scale(1.05) translate3d(0, 0, 0)' },
          '100%': { transform: 'scale(1.16) translate3d(-1.5%, -1%, 0)' },
        },
        gradientX: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        orb: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(-30px, 24px, 0) scale(1.12)' },
        },
        orbAlt: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(36px, -22px, 0) scale(1.1)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        spinReverse: {
          to: { transform: 'rotate(-360deg)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        float: 'float 5s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        kenburns: 'kenburns 26s ease-in-out infinite alternate',
        'gradient-x': 'gradientX 5s ease-in-out infinite alternate',
        orb: 'orb 14s ease-in-out infinite',
        'orb-alt': 'orbAlt 18s ease-in-out infinite',
        'spin-slow': 'spin 70s linear infinite',
        'spin-slow-reverse': 'spinReverse 90s linear infinite',
      },
      boxShadow: {
        'industrial': '0 10px 30px -10px rgba(16, 38, 80, 0.12)',
        'industrial-lg': '0 20px 45px -15px rgba(16, 38, 80, 0.22)',
        'glow-accent': '0 0 30px -5px rgba(22, 133, 248, 0.45)',
        'glow-navy': '0 0 35px -5px rgba(16, 38, 80, 0.55)',
      }
    },
  },
  plugins: [],
}
