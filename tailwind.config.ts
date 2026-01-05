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
                // === GLASSMORPHISM PRO COLOR PALETTE ===

                // Obsidian Scale - Deep Blacks
                obsidian: {
                    950: '#030303',
                    900: '#050505',
                    850: '#0A0A0A',
                    800: '#121215',
                    750: '#1A1A1F',
                },

                // Luxury Metals - Gold
                gold: {
                    50: '#FDF8E7',
                    100: '#F9EBC5',
                    200: '#F2D68A',
                    300: '#E8BE4E',
                    400: '#D4AF37',
                    500: '#B8960B',
                    600: '#957A09',
                    700: '#735E07',
                },

                // Luxury Metals - Copper
                copper: {
                    50: '#FCF3EB',
                    100: '#F7DFD0',
                    200: '#EEBB9F',
                    300: '#DE926A',
                    400: '#CD7F32',
                    500: '#B87333',
                    600: '#9A5D28',
                },

                // Background Layers (Legacy)
                'bg-base': '#09090B',      // Zinc 950 - darkest
                'bg-elevated': '#18181B',  // Zinc 900
                'bg-surface': '#27272A',   // Zinc 800
                'bg-muted': '#3F3F46',     // Zinc 700

                // Text Colors
                'text-primary': '#FAFAFA',   // Zinc 50
                'text-secondary': '#A1A1AA', // Zinc 400
                'text-muted': '#71717A',     // Zinc 500

                // Toned Logo Colors
                'accent-cyan': '#00B4B7',
                'accent-cyan-muted': '#008F91',
                'accent-violet': '#5060D0',
                'accent-violet-muted': '#4050A0',
                'accent-emerald': '#3DB876',
                'accent-coral': '#E85D4A',
                'accent-rose': '#E84570',

                // Logo Color Palette (Original)
                'accent-primary': '#00CED1',      // Turkuaz - Ana renk
                'accent-secondary': '#5E6FEA',    // Mor - İkincil renk
                'accent-green': '#47CF86',        // Yeşil
                'accent-orange': '#FB6B4E',       // Turuncu
                'accent-pink': '#FF4B7B',         // Pembe
                'accent-primary-light': '#20E5E8',
                'accent-secondary-light': '#7A8AFF',

                // Legacy compatibility - alias to logo colors
                'accent-amber': '#00CED1',
                'accent-red': '#5E6FEA',
                'accent-amber-light': '#20E5E8',
                'accent-red-light': '#7A8AFF',

                // Semantic Colors
                success: {
                    DEFAULT: '#47CF86', // Logo Green
                    light: '#6DD9A0',
                },
                warning: {
                    DEFAULT: '#FB6B4E', // Logo Orange
                    light: '#FF8A6F',
                },
                danger: {
                    DEFAULT: '#FF4B7B', // Logo Pink
                    light: '#FF6B9B',
                },
                info: {
                    DEFAULT: '#00CED1', // Logo Turkuaz
                    light: '#20E5E8',
                },

                // Glass Colors
                'glass-bg': 'rgba(24, 24, 27, 0.6)',
                'glass-border': 'rgba(0, 206, 209, 0.1)',
                'glass-border-hover': 'rgba(0, 206, 209, 0.2)',

                // Legacy colors (for backward compatibility)
                primary: {
                    DEFAULT: "#18181B",
                    light: "#27272A",
                    dark: "#09090B",
                },
                secondary: {
                    DEFAULT: "#00CED1",
                    light: "#20E5E8",
                    dark: "#00A8AB",
                },
                accent: {
                    primary: "#00CED1",
                    secondary: "#5E6FEA",
                    green: "#47CF86",
                    orange: "#FB6B4E",
                    pink: "#FF4B7B",
                    // Legacy aliases
                    gold: "#00CED1",
                    red: "#5E6FEA",
                    amber: "#00CED1",
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
                // === GLASSMORPHISM PRO GRADIENTS ===
                // Gold Gradients
                'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #CD7F32 100%)',
                'gradient-gold-reverse': 'linear-gradient(135deg, #CD7F32 0%, #D4AF37 100%)',
                'gradient-gold-soft': 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(205, 127, 50, 0.15) 100%)',
                'gradient-gold-vertical': 'linear-gradient(180deg, #D4AF37 0%, #CD7F32 100%)',
                'gradient-gold-radial': 'radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',

                // Logo Color Gradients (Original)
                'gradient-warm': 'linear-gradient(135deg, #00CED1 0%, #5E6FEA 100%)',
                'gradient-warm-reverse': 'linear-gradient(135deg, #5E6FEA 0%, #00CED1 100%)',
                'gradient-warm-soft': 'linear-gradient(135deg, rgba(0, 206, 209, 0.2) 0%, rgba(94, 111, 234, 0.2) 100%)',
                'gradient-warm-glow': 'radial-gradient(circle at center, rgba(0, 206, 209, 0.15) 0%, transparent 70%)',

                // Glass
                'glass': 'rgba(24, 24, 27, 0.6)',

                // Legacy
                'hero-gradient': 'linear-gradient(135deg, #00CED1 0%, #5E6FEA 100%)',
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
                // === GLASSMORPHISM PRO SHADOWS ===
                // Gold Glow Effects
                'glow-gold': '0 0 20px rgba(212, 175, 55, 0.35)',
                'glow-gold-sm': '0 0 12px rgba(212, 175, 55, 0.25)',
                'glow-gold-lg': '0 0 40px rgba(212, 175, 55, 0.4)',
                'glow-gold-xl': '0 0 60px rgba(212, 175, 55, 0.35), 0 0 100px rgba(212, 175, 55, 0.2)',
                'glow-copper': '0 0 20px rgba(205, 127, 50, 0.3)',
                'glow-copper-lg': '0 0 40px rgba(205, 127, 50, 0.35)',

                // Glass Pro Shadows
                'glass-sm': '0 2px 8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(212, 175, 55, 0.03)',
                'glass-md': '0 4px 24px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 175, 55, 0.05)',
                'glass-lg': '0 8px 48px rgba(0, 0, 0, 0.6), 0 0 60px rgba(212, 175, 55, 0.08)',
                'glass-xl': '0 16px 80px rgba(0, 0, 0, 0.7), 0 0 100px rgba(212, 175, 55, 0.1)',

                // Inner Glow
                'inner-gold': 'inset 0 1px 0 rgba(212, 175, 55, 0.15), inset 0 0 60px rgba(212, 175, 55, 0.08)',
                'inner-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',

                // Logo Color Glow Effects (Original)
                'glow-amber': '0 0 20px rgba(0, 206, 209, 0.4)',
                'glow-amber-lg': '0 0 40px rgba(0, 206, 209, 0.5)',
                'glow-amber-xl': '0 0 60px rgba(0, 206, 209, 0.4), 0 0 100px rgba(0, 206, 209, 0.2)',
                'glow-red': '0 0 20px rgba(94, 111, 234, 0.4)',
                'glow-warm': '0 0 30px rgba(0, 206, 209, 0.3), 0 0 60px rgba(94, 111, 234, 0.15)',

                // Glass Card Shadows
                'glass-card': '0 4px 24px rgba(0, 0, 0, 0.2), 0 0 40px rgba(0, 206, 209, 0.05)',
                'glass-card-hover': '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(0, 206, 209, 0.1)',

                // Semantic Glows - Logo Colors
                'glow-success': '0 0 20px rgba(71, 207, 134, 0.4)',
                'glow-danger': '0 0 20px rgba(255, 75, 123, 0.4)',
                'glow-warning': '0 0 20px rgba(251, 107, 78, 0.4)',
                'glow-info': '0 0 20px rgba(0, 206, 209, 0.4)',

                // Legacy
                'glow-primary': '0 0 20px rgba(0, 206, 209, 0.4)',
                'glow-lg': '0 0 40px rgba(0, 206, 209, 0.3), 0 0 80px rgba(0, 206, 209, 0.1)',
            },
        },
    },
    plugins: [],
};
export default config;
