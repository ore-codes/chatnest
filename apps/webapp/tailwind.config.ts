import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neutral: "#96c624",
        primary: "#203d2f",
        secondary: "#083E2C",
        text: "#0C2039",
        light: "#F5F5F5",
        dark: "#292D32",
        placeholder: "#9095A1",
        white: "#FFFFFF",
        danger: "#E33629",
        lightGrey: "#FBFBFB",
        warning: "#E8871E",
      },
    },
  },
  plugins: [],
} satisfies Config;
