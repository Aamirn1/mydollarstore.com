import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Orbitron', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        cyan: {
          DEFAULT: 'var(--cyan)',
          foreground: 'var(--cyan-foreground)',
          50: 'oklch(0.97 0.02 195)',
          100: 'oklch(0.93 0.05 195)',
          200: 'oklch(0.85 0.1 195)',
          300: 'oklch(0.78 0.15 195)',
          400: 'oklch(0.72 0.19 195)',
          500: 'oklch(0.65 0.19 195)',
          600: 'oklch(0.55 0.18 195)',
          700: 'oklch(0.45 0.15 195)',
          800: 'oklch(0.35 0.1 195)',
          900: 'oklch(0.25 0.06 195)',
        },
        teal: {
          DEFAULT: 'var(--teal)',
          foreground: 'var(--teal-foreground)',
          50: 'oklch(0.97 0.02 180)',
          100: 'oklch(0.93 0.05 180)',
          200: 'oklch(0.85 0.1 180)',
          300: 'oklch(0.78 0.15 180)',
          400: 'oklch(0.75 0.2 180)',
          500: 'oklch(0.65 0.18 180)',
          600: 'oklch(0.55 0.15 180)',
          700: 'oklch(0.45 0.12 180)',
          800: 'oklch(0.35 0.08 180)',
          900: 'oklch(0.25 0.05 180)',
        },
        dark: {
          DEFAULT: 'oklch(0.13 0.01 250)',
          50: 'oklch(0.22 0.01 250)',
          100: 'oklch(0.2 0.01 250)',
          200: 'oklch(0.18 0.015 250)',
          300: 'oklch(0.16 0.012 250)',
          400: 'oklch(0.14 0.01 250)',
          500: 'oklch(0.13 0.01 250)',
          600: 'oklch(0.11 0.01 250)',
          700: 'oklch(0.09 0.01 250)',
          800: 'oklch(0.07 0.01 250)',
          900: 'oklch(0.05 0.005 250)',
        },
        chart: {
          '1': 'var(--chart-1)',
          '2': 'var(--chart-2)',
          '3': 'var(--chart-3)',
          '4': 'var(--chart-4)',
          '5': 'var(--chart-5)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 5px oklch(0.72 0.19 195 / 0.2), 0 0 10px oklch(0.72 0.19 195 / 0.1)',
          },
          '50%': {
            boxShadow: '0 0 15px oklch(0.72 0.19 195 / 0.4), 0 0 30px oklch(0.72 0.19 195 / 0.2)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-6px)',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-200% 0',
          },
          '100%': {
            backgroundPosition: '200% 0',
          },
        },
        'fade-in': {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        'slide-up': {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-down': {
          from: {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
