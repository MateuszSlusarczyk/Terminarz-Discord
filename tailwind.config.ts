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
        background: "#313338",
        backgroundDark:"#111214",
        textMain:"#F2F3F5",
        textSub:"#B5BAC1",
        accent1: "#0D7377",
        accent2:"#BB86FC",
        Tak: "#4CAF50",
        Nie:"#F44336",
        Może:"#FF9800"
      },
      animation: {
        brightness: "brightnessPulse 2s infinite ease-in-out",
      },
      keyframes: {
        brightnessPulse: {
          "0%": { filter: "brightness(100%)" },
          "50%": { filter: "brightness(130%)" },
          "100%": { filter: "brightness(100%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
