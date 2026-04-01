import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // CatCat 配色方案 - 大地色系
        caramel: {
          DEFAULT: '#C8956C',
          50: '#FDF8F3',
          100: '#F7F0E9',
          200: '#E8D5C4',
          300: '#D4B99A',
          400: '#C8956C',
          500: '#B87D4F',
          600: '#9A6539',
          700: '#7C4F2E',
          800: '#5E3922',
          900: '#402317',
        },
        cream: {
          DEFAULT: '#F7F3EF',
          50: '#FDFCFB',
          100: '#F7F3EF',
          200: '#EFE8DF',
          300: '#E5D9CC',
          400: '#D4C4B0',
          500: '#C2AF94',
        },
        warmblack: {
          DEFAULT: '#2D2926',
          50: '#5C5552',
          100: '#524D49',
          200: '#433D39',
          300: '#342E2A',
          400: '#2D2926',
          500: '#1A1614',
          600: '#0D0B0A',
          700: '#000000',
        },
      },
      fontFamily: {
        display: ['DM Sans', 'sans-serif'],
        body: ['Crimson Pro', 'serif'],
      },
      // 使用弹性曲线的动画
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      // 噪点纹理背景
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}

export default config
