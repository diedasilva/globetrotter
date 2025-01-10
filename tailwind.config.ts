import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mocha: "#6D4C41",
        ivory: "#F5F5F5",
        taupe: "#BDB9B7",
        charcoal: "#3C3C3B",
        sand: "#E4DCD2",
      },
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
        serif: ["Merriweather", "serif"],
		mono: ["'Courier Prime'", "monospace"],
      },
      borderRadius: {
        soft: "5px",
		medium:	"8px",
      },
    },
  },
  plugins: [],
} satisfies Config;
