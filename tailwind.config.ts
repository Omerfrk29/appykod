import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#5E6FEA",
                    light: "#8B96F0",
                    dark: "#4254D6",
                    50: "#ECEEFF",
                    100: "#D8DDFF",
                    200: "#B1BBFF",
                    300: "#8B96F0",
                    400: "#5E6FEA",
                    500: "#4254D6",
                    600: "#3340A8",
                    700: "#252F7A",
                    800: "#181F4C",
                    900: "#0A0F1E",
                },
                success: {
                    DEFAULT: "#47CF86",
                    light: "#6EDBA0",
                    dark: "#2EB36C",
                },
                warning: {
                    DEFAULT: "#FB6B4E",
                    light: "#FC8D76",
                    dark: "#E94D2D",
                },
                danger: {
                    DEFAULT: "#FF4B7B",
                    light: "#FF7A9E",
                    dark: "#E62958",
                },
                info: {
                    DEFAULT: "#00CED1",
                    light: "#33D8DA",
                    dark: "#00A8AA",
                },
                accent: {
                    gold: "#FFD700",
                    purple: "#9B59B6",
                    coral: "#FF6B6B",
                    mint: "#00D9A5",
                },
            },
            fontFamily: {
                sans: ['var(--font-anek-latin)', '"Anek Latin"', 'sans-serif'],
                logo: ['var(--font-logo)', '"Special Gothic Expanded One"', 'cursive'],
            },
            letterSpacing: {
                tightest: '-0.075em',
                tighter: '-0.05em',
                wider: '0.1em',
                widest: '0.2em',
            },
            lineHeight: {
                tighter: '1.1',
                relaxed: '1.75',
            },
            animation: {
                'gradient-x': 'gradient-x 3s ease infinite',
                'gradient-y': 'gradient-y 3s ease infinite',
                'gradient-xy': 'gradient-xy 6s ease infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float-slow 8s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'pulse-glow-success': 'pulse-glow-success 2s ease-in-out infinite',
                'pulse-glow-danger': 'pulse-glow-danger 2s ease-in-out infinite',
                'pulse-glow-warning': 'pulse-glow-warning 2s ease-in-out infinite',
                'pulse-glow-info': 'pulse-glow-info 2s ease-in-out infinite',
                'rotate-slow': 'rotate-slow 20s linear infinite',
                'scale-pulse': 'scale-pulse 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                // New animations
                'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
                'slide-up-fade': 'slide-up-fade 0.5s ease-out',
                'slide-down-fade': 'slide-down-fade 0.5s ease-out',
                'wiggle': 'wiggle 0.5s ease-in-out',
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
                'text-shimmer': 'text-shimmer 3s ease-in-out infinite',
                'border-dance': 'border-dance 4s linear infinite',
                'morph': 'morph 8s ease-in-out infinite',
                'aurora': 'aurora 15s ease-in-out infinite',
                'sparkle': 'sparkle 2s ease-in-out infinite',
                'tilt-shake': 'tilt-shake 0.5s ease-in-out',
            },
            keyframes: {
                'gradient-x': {
                    '0%, 100%': {
                        'background-position': '0% 50%',
                    },
                    '50%': {
                        'background-position': '100% 50%',
                    },
                },
                'gradient-y': {
                    '0%, 100%': {
                        'background-position': '50% 0%',
                    },
                    '50%': {
                        'background-position': '50% 100%',
                    },
                },
                'gradient-xy': {
                    '0%, 100%': {
                        'background-position': '0% 50%, 50% 0%',
                    },
                    '25%': {
                        'background-position': '100% 50%, 50% 100%',
                    },
                    '50%': {
                        'background-position': '100% 50%, 50% 100%',
                    },
                    '75%': {
                        'background-position': '0% 50%, 50% 0%',
                    },
                },
                'float': {
                    '0%, 100%': {
                        transform: 'translateY(0px) rotate(0deg)',
                    },
                    '33%': {
                        transform: 'translateY(-20px) rotate(5deg)',
                    },
                    '66%': {
                        transform: 'translateY(10px) rotate(-5deg)',
                    },
                },
                'float-slow': {
                    '0%, 100%': {
                        transform: 'translateY(0px) translateX(0px)',
                    },
                    '50%': {
                        transform: 'translateY(-30px) translateX(20px)',
                    },
                },
                'pulse-glow': {
                    '0%, 100%': {
                        opacity: '1',
                        'box-shadow': '0 0 20px rgba(94, 111, 234, 0.5)',
                    },
                    '50%': {
                        opacity: '0.8',
                        'box-shadow': '0 0 40px rgba(94, 111, 234, 0.8), 0 0 60px rgba(94, 111, 234, 0.4)',
                    },
                },
                'pulse-glow-success': {
                    '0%, 100%': {
                        opacity: '1',
                        'box-shadow': '0 0 20px rgba(71, 207, 134, 0.5)',
                    },
                    '50%': {
                        opacity: '0.8',
                        'box-shadow': '0 0 40px rgba(71, 207, 134, 0.8), 0 0 60px rgba(71, 207, 134, 0.4)',
                    },
                },
                'pulse-glow-danger': {
                    '0%, 100%': {
                        opacity: '1',
                        'box-shadow': '0 0 20px rgba(255, 75, 123, 0.5)',
                    },
                    '50%': {
                        opacity: '0.8',
                        'box-shadow': '0 0 40px rgba(255, 75, 123, 0.8), 0 0 60px rgba(255, 75, 123, 0.4)',
                    },
                },
                'pulse-glow-warning': {
                    '0%, 100%': {
                        opacity: '1',
                        'box-shadow': '0 0 20px rgba(251, 107, 78, 0.5)',
                    },
                    '50%': {
                        opacity: '0.8',
                        'box-shadow': '0 0 40px rgba(251, 107, 78, 0.8), 0 0 60px rgba(251, 107, 78, 0.4)',
                    },
                },
                'pulse-glow-info': {
                    '0%, 100%': {
                        opacity: '1',
                        'box-shadow': '0 0 20px rgba(0, 206, 209, 0.5)',
                    },
                    '50%': {
                        opacity: '0.8',
                        'box-shadow': '0 0 40px rgba(0, 206, 209, 0.8), 0 0 60px rgba(0, 206, 209, 0.4)',
                    },
                },
                'rotate-slow': {
                    from: {
                        transform: 'rotate(0deg)',
                    },
                    to: {
                        transform: 'rotate(360deg)',
                    },
                },
                'scale-pulse': {
                    '0%, 100%': {
                        transform: 'scale(1)',
                    },
                    '50%': {
                        transform: 'scale(1.1)',
                    },
                },
                'shimmer': {
                    '0%': {
                        'background-position': '-1000px 0',
                    },
                    '100%': {
                        'background-position': '1000px 0',
                    },
                },
                // New keyframes
                'bounce-gentle': {
                    '0%, 100%': {
                        transform: 'translateY(0)',
                    },
                    '50%': {
                        transform: 'translateY(-10px)',
                    },
                },
                'slide-up-fade': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(20px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                'slide-down-fade': {
                    '0%': {
                        opacity: '0',
                        transform: 'translateY(-20px)',
                    },
                    '100%': {
                        opacity: '1',
                        transform: 'translateY(0)',
                    },
                },
                'wiggle': {
                    '0%, 100%': {
                        transform: 'rotate(0deg)',
                    },
                    '25%': {
                        transform: 'rotate(-5deg)',
                    },
                    '75%': {
                        transform: 'rotate(5deg)',
                    },
                },
                'glow-pulse': {
                    '0%, 100%': {
                        'box-shadow': '0 0 20px rgba(94, 111, 234, 0.4), 0 0 40px rgba(94, 111, 234, 0.2)',
                    },
                    '50%': {
                        'box-shadow': '0 0 40px rgba(94, 111, 234, 0.6), 0 0 80px rgba(94, 111, 234, 0.4)',
                    },
                },
                'text-shimmer': {
                    '0%': {
                        'background-position': '-200% center',
                    },
                    '100%': {
                        'background-position': '200% center',
                    },
                },
                'border-dance': {
                    '0%, 100%': {
                        'background-position': '0% 50%',
                    },
                    '50%': {
                        'background-position': '100% 50%',
                    },
                },
                'morph': {
                    '0%, 100%': {
                        'border-radius': '60% 40% 30% 70% / 60% 30% 70% 40%',
                    },
                    '50%': {
                        'border-radius': '30% 60% 70% 40% / 50% 60% 30% 60%',
                    },
                },
                'aurora': {
                    '0%, 100%': {
                        'background-position': '50% 50%, 50% 50%',
                    },
                    '25%': {
                        'background-position': '0% 50%, 100% 50%',
                    },
                    '50%': {
                        'background-position': '50% 100%, 50% 0%',
                    },
                    '75%': {
                        'background-position': '100% 50%, 0% 50%',
                    },
                },
                'sparkle': {
                    '0%, 100%': {
                        opacity: '0',
                        transform: 'scale(0) rotate(0deg)',
                    },
                    '50%': {
                        opacity: '1',
                        transform: 'scale(1) rotate(180deg)',
                    },
                },
                'tilt-shake': {
                    '0%, 100%': {
                        transform: 'rotate(0deg)',
                    },
                    '25%': {
                        transform: 'rotate(-2deg)',
                    },
                    '75%': {
                        transform: 'rotate(2deg)',
                    },
                },
            },
            backgroundSize: {
                'gradient-size': '200% 200%',
                '300%': '300% 300%',
                '400%': '400% 400%',
            },
            boxShadow: {
                'glow-primary': '0 0 20px rgba(94, 111, 234, 0.4)',
                'glow-success': '0 0 20px rgba(71, 207, 134, 0.4)',
                'glow-danger': '0 0 20px rgba(255, 75, 123, 0.4)',
                'glow-warning': '0 0 20px rgba(251, 107, 78, 0.4)',
                'glow-info': '0 0 20px rgba(0, 206, 209, 0.4)',
                'glow-lg': '0 0 40px rgba(94, 111, 234, 0.3), 0 0 80px rgba(94, 111, 234, 0.1)',
            },
        },
    },
    plugins: [],
};
export default config;
