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
                primary: "#5E6FEA",
                success: "#47CF86",
                warning: "#FB6B4E",
                danger: "#FF4B7B",
                info: "#00CED1",
            },
            fontFamily: {
                sans: ['"Anek Latin"', 'sans-serif'],
                logo: ['"Special Gothic Expanded One"', 'cursive'],
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
            },
            backgroundSize: {
                'gradient-size': '200% 200%',
            },
        },
    },
    plugins: [],
};
export default config;
