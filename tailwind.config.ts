import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        "background-light": "rgb(var(--background-light) / <alpha-value>)",
        "border-light": "rgb(var(--border-light) / <alpha-value>)",
        placeholder: "rgb(var(--placeholder) / <alpha-value>)",
      },
    },
  },
  plugins: [],
} satisfies Config;
