import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#000000",
        surface: {
          DEFAULT: "#000000",
          50: "#000000",
          100: "#0a0a0a",
          200: "#121212",
          300: "#171717",
          400: "#262626",
        },
        "surface-raised": "#0a0a0a",
        "surface-border": "#27272a",
        brand: {
          50: "#e6f1fe",
          100: "#cce3fd",
          200: "#99c7fb",
          300: "#66aaf9",
          400: "#338ef7",
          500: "#0070f3",
          600: "#0062d6",
          700: "#0053ba",
          800: "#00459e",
          900: "#003681",
          950: "#002865",
        },
        accent: {
          cyan: "#38bdf8",
          teal: "#2dd4bf",
          emerald: "#34d399",
          amber: "#fbbf24",
          rose: "#fb7185",
          indigo: "#818cf8",
          violet: "#a78bfa",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "none",
        "glow-cyan": "none",
        "glow-emerald": "none",
        "glow-amber": "none",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-grid": "none",
      },
      animation: {
        "pulse-slow": "none",
        "float": "none",
      },
      keyframes: {},
    },
  },
  plugins: [],
};

export default config;
