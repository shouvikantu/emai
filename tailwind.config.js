/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-lato)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        ink: {
          DEFAULT: "#0e1117",
          50: "#f4f4f6",
          100: "#e2e3e8",
          200: "#b8bac8",
          300: "#8a8da6",
          400: "#5e6180",
          500: "#3d4060",
          600: "#272a42",
          700: "#1a1d2e",
          800: "#12141f",
          900: "#0e1117",
        },
        amber: {
          DEFAULT: "#f5a623",
          50: "#fef9ee",
          100: "#fdf0d0",
          200: "#fad99a",
          300: "#f7c15f",
          400: "#f5a623",
          500: "#e08c0a",
          600: "#b86e07",
          700: "#8a500a",
          800: "#5c370b",
          900: "#3a220a",
        },
        sage: {
          DEFAULT: "#7eb89a",
          50: "#f0f7f3",
          100: "#d4ece0",
          200: "#a8d8be",
          300: "#7eb89a",
          400: "#5a9a7a",
          500: "#3e7a5e",
          600: "#2e5c47",
          700: "#1e3d30",
          800: "#122619",
          900: "#0a160f",
        },
        coral: {
          DEFAULT: "#e8755a",
          400: "#e8755a",
          500: "#d45c40",
          600: "#b84530",
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};
