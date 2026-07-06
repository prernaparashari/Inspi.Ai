/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep Indigo/Purple theme matching your professional reference image
        bg: "var(--color-bg)",
        "bg-2": "var(--color-bg2)",
        surface: "var(--color-surface)",
        primary: {
          DEFAULT: "var(--color-primary)",
          dark: "var(--color-primary-dark)",
        },
        accent: "var(--color-accent)",
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-muted)",
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};