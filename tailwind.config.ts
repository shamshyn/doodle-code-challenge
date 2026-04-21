import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#6B7280',
        background: '#F3F4F6',
        'bubble-sender': '#DBEAFE',
        'bubble-receiver': '#E5E7EB',
        text: '#1F2937',
        'text-secondary': '#6B7280',
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        'lg': '10px',
        'xl': '15px',
        'full': '9999px',
      },
    },
  },
  plugins: [],
};
export default config;
