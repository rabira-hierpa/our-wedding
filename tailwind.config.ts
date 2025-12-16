import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        champagne: {
          50: "#faf9f7",
          100: "#f5f3ee",
          200: "#ebe7dd",
          300: "#ddd7c7",
          400: "#ccc3ad",
          500: "#b8aa8e",
          600: "#a39174",
          700: "#8a7860",
          800: "#73644f",
          900: "#5e5342",
        },
        gold: {
          50: "#fefbf3",
          100: "#fdf6e3",
          200: "#faecc4",
          300: "#f6dd9b",
          400: "#f0c75f",
          500: "#d4af37",
          600: "#b8941f",
          700: "#937419",
          800: "#795e19",
          900: "#654e1a",
        },
        blush: {
          50: "#fef7f7",
          100: "#fdeaea",
          200: "#fbd5d5",
          300: "#f7b5b5",
          400: "#f08888",
          500: "#e65f5f",
          600: "#d13f3f",
          700: "#af2f2f",
          800: "#912a2a",
          900: "#792828",
        },
        ivory: {
          50: "#fffffe",
          100: "#fffffd",
          200: "#fffffa",
          300: "#fffff5",
          400: "#fffff0",
          500: "#ffffeb",
          600: "#f5f5e6",
          700: "#e6e6d7",
          800: "#d7d7c8",
          900: "#c8c8b9",
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
