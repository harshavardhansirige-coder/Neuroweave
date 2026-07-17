/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        outfit: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        border: "rgba(255, 255, 255, 0.08)",
        input: "rgba(255, 255, 255, 0.05)",
        ring: "rgba(139, 92, 246, 0.5)",
        background: "#030014",
        foreground: "#f8fafc",
        primary: {
          DEFAULT: "#8b5cf6",
          foreground: "#ffffff",
          dark: "#7c3aed",
          light: "#a78bfa"
        },
        secondary: {
          DEFAULT: "#0ea5e9",
          foreground: "#ffffff",
          dark: "#0284c7",
          light: "#38bdf8"
        },
        accent: {
          DEFAULT: "#ec4899",
          foreground: "#ffffff",
          dark: "#db2777",
          light: "#f472b6"
        },
        card: {
          DEFAULT: "rgba(17, 12, 46, 0.45)",
          foreground: "#f8fafc"
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': "linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)"
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 8px 32px 0 rgba(139, 92, 246, 0.15)',
        'neon': '0 0 15px rgba(139, 92, 246, 0.35)',
        'neon-secondary': '0 0 15px rgba(14, 165, 233, 0.35)'
      },
      animation: {
        'pulse-slow': 'pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 30s linear infinite',
        'tilt': 'tilt 10s infinite linear'
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        }
      }
    },
  },
  plugins: [],
}
