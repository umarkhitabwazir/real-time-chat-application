/** @type {import('tailwindcss').Config} */
export const darkMode = 'class';
export const content = [
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
  "./app/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
  extend: {
    colors: {
      background: "var(--background)",
      foreground: "var(--foreground)",
    },
    fontFamily: {
      sans: ['var(--font-sans)', 'sans-serif'],
      mono: ['var(--font-mono)', 'monospace'],
    },
  },
};
export const plugins = [];
