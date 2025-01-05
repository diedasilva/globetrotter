import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mocha: {
          DEFAULT: "#6D4C41", // Mocha Mousse
        },
        ivory: {
          DEFAULT: "#F5F5F5", // Fond clair
        },
        taupe: {
          DEFAULT: "#BDB9B7", // Texte ou bordures neutres
        },
        charcoal: {
          DEFAULT: "#3C3C3B", // Noir adouci
        },
        sand: {
          DEFAULT: "#E4DCD2", // Ton beige
        },
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"], // Police principale
        serif: ["Merriweather", "serif"], // Police pour les titres
      },
      borderRadius: {
        soft: "5px", 
      },
    },
  },
  plugins: [],
} satisfies Config;
