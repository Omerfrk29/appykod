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
                // === WARM LUXURY PALETTE ===
                // Background Layers
                'bg-base': '#09090B',      // Zinc 950 - darkest
                'bg-elevated': '#18181B',  // Zinc 900
                'bg-surface': '#27272A',   // Zinc 800
                'bg-muted': '#3F3F46',     // Zinc 700

                // Text Colors
                'text-primary': '#FAFAFA',   // Zinc 50
                'text-secondary': '#A1A1AA', // Zinc 400
                'text-muted': '#71717A',     // Zinc 500

                // Accent Colors
                'accent-amber': '#F59E0B',  // Amber 500
                'accent-red': '#EF4444',    // Red 500
                'accent-amber-light': '#FBBF24', // Amber 400
                'accent-red-light': '#F87171',   // Red 400

                // Semantic Colors
                success: {
                    DEFAULT: '#22C55E', // Green 500
                    light: '#4ADE80',
                },
                warning: {
                    DEFAULT: '#F59E0B', // Amber 500
                    light: '#FBBF24',
                },
                danger: {
                    DEFAULT: '#EF4444', // Red 500
                    light: '#F87171',
                },
                info: {
                    DEFAULT: '#3B82F6', // Blue 500
                    light: '#60A5FA',
                },

                // Glass Colors
                'glass-bg': 'rgba(24, 24, 27, 0.6)',
                'glass-border': 'rgba(245, 158, 11, 0.1)',
                'glass-border-hover': 'rgba(245, 158, 11, 0.2)',

                // Legacy colors (for backward compatibility)
                primary: {
                    DEFAULT: "#18181B",
                    light: "#27272A",
                    dark: "#09090B",
                },
                secondary: {
                    DEFAULT: "#F59E0B",
                    light: "#FBBF24",
                    dark: "#D97706",
                },
                accent: {
                    gold: "#F59E0B",
                    red: "#EF4444",
                    amber: "#F59E0B",
                },
                background: {
                    dark: "#09090B",
                    light: "#FAFAFA",
                },
            },
            fontFamily: {
                sans: ['Satoshi', 'var(--font-satoshi)', 'system-ui', 'sans-serif'],
                heading: ['Satoshi', 'var(--font-satoshi)', 'system-ui', 'sans-serif'],
                logo: ['var(--font-logo)', '"Special Gothic Expanded One"', 'cursive'],
            },
            fontSize: {
                // Heading sizes with line-height and letter-spacing
                'display': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'h1': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
                'h2': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
                'h3': ['1.75rem', { lineHeight: '1.3', letterSpacing: '0' }],
                'h4': ['1.25rem', { lineHeight: '1.4', letterSpacing: '0' }],
                'body-lg': ['1.125rem', { lineHeight: '1.6' }],
                'body': ['1rem', { lineHeight: '1.6' }],
                'body-sm': ['0.875rem', { lineHeight: '1.5' }],
                'caption': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em' }],
            },
            fontWeight: {
                regular: '400',
                medium: '500',
                bold: '700',
                black: '900',
            },
            backgroundImage: {
                // Warm Luxury Gradients
                'gradient-warm': 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
                'gradient-warm-reverse': 'linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)',
                'gradient-warm-soft': 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.2) 100%)',
                'gradient-warm-glow': 'radial-gradient(circle at center, rgba(245, 158, 11, 0.15) 0%, transparent 70%)',
                // Glass
                'glass': 'rgba(24, 24, 27, 0.6)',
                // Legacy
                'hero-gradient': 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
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
                'gradient-x': 'gradient-x 5s ease infinite',
                'float': 'float 6s ease-in-out infinite',
                'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
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
                'pulse-soft': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
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
                // Warm Luxury Glow Effects
                'glow-amber': '0 0 20px rgba(245, 158, 11, 0.4)',
                'glow-amber-lg': '0 0 40px rgba(245, 158, 11, 0.5)',
                'glow-amber-xl': '0 0 60px rgba(245, 158, 11, 0.4), 0 0 100px rgba(245, 158, 11, 0.2)',
                'glow-red': '0 0 20px rgba(239, 68, 68, 0.4)',
                'glow-warm': '0 0 30px rgba(245, 158, 11, 0.3), 0 0 60px rgba(239, 68, 68, 0.15)',
                // Glass Card Shadows
                'glass-card': '0 4px 24px rgba(0, 0, 0, 0.2), 0 0 40px rgba(245, 158, 11, 0.05)',
                'glass-card-hover': '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(245, 158, 11, 0.1)',
                // Semantic Glows
                'glow-success': '0 0 20px rgba(34, 197, 94, 0.4)',
                'glow-danger': '0 0 20px rgba(239, 68, 68, 0.4)',
                'glow-warning': '0 0 20px rgba(245, 158, 11, 0.4)',
                'glow-info': '0 0 20px rgba(59, 130, 246, 0.4)',
                // Legacy
                'glow-primary': '0 0 20px rgba(245, 158, 11, 0.4)',
                'glow-lg': '0 0 40px rgba(245, 158, 11, 0.3), 0 0 80px rgba(245, 158, 11, 0.1)',
            },
        },
    },
    plugins: [],
};
export default config;
