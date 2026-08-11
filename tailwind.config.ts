import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        border: "#E5E5E5",
        gray: {
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      fontSize: {
        xs: ["11px", { letterSpacing: "0.05em" }],
        sm: ["13px", { letterSpacing: "0.03em" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      maxWidth: {
        content: "1440px",
      },
    },
  },
  plugins: [],
};

export default config;