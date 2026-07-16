import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        ember: "#ff8c42",
        emberDeep: "#e5622b",
        indigoNight: "#141733",
        ghee: "#ffcf6b",
      },
      keyframes: {
        driftUp: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0" },
          "15%": { opacity: "0.9" },
          "100%": { transform: "translateY(-120px) scale(0.4)", opacity: "0" },
        },
        breathe: {
          "0%,100%": { opacity: "0.85" },
          "50%": { opacity: "1" },
        },
        ripple: {
          "0%": { transform: "scale(0.2)", opacity: "0.55" },
          "100%": { transform: "scale(2.6)", opacity: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        driftUp: "driftUp 3.2s ease-out infinite",
        breathe: "breathe 7s ease-in-out infinite",
        ripple: "ripple 1.6s ease-out forwards",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
