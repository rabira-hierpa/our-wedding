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
      },
    },
  },
  plugins: [],
} satisfies Config;
