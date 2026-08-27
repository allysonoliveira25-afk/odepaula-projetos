import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#08090a",
        graphite: "#141517",
        steel: "#2a2c30",
        silver: "#c7cad1",
        platinum: "#e8eaee",
        chrome: "#9ea3ad",
        glint: "#f4f6fb",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      backgroundImage: {
        "metal-gradient":
          "linear-gradient(135deg, #08090a 0%, #1c1e21 35%, #3a3d43 50%, #1c1e21 65%, #08090a 100%)",
        "metal-line":
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
        "chrome-radial":
          "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.12), transparent 45%)",
        "card-metal":
          "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 40%, rgba(0,0,0,0.2) 100%)",
      },
      boxShadow: {
        metal: "0 8px 30px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        glow: "0 0 40px rgba(199,202,209,0.15)",
      },
      keyframes: {
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        shine: "shine 3.5s linear infinite",
        float: "float 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.7s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
