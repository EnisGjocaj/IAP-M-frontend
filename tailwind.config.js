/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			primary: {
  				DEFAULT: '#FFD700',
  				foreground: 'var(--primary-foreground)'
  			},
  			secondary: {
  				DEFAULT: '#00308F',
  				foreground: 'var(--secondary-foreground)'
  			},
  			backbg: 'rgba(43, 78, 255, 0.7)',
  			neutral: {
  				'850': '#1f2937'
  			},
  			border: 'var(--border)',
  			input: 'var(--input)',
  			ring: 'var(--ring)',
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			destructive: {
  				DEFAULT: 'var(--destructive)',
  				foreground: 'var(--destructive-foreground)'
  			},
  			muted: {
  				DEFAULT: 'var(--muted)',
  				foreground: 'var(--muted-foreground)'
  			},
  			accent: {
  				DEFAULT: 'var(--accent)',
  				foreground: 'var(--accent-foreground)'
  			},
  			popover: {
  				DEFAULT: 'var(--popover)',
  				foreground: 'var(--popover-foreground)'
  			},
  			card: {
  				DEFAULT: 'var(--card)',
  				foreground: 'var(--card-foreground)'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		boxShadow: {
  			shadow1: '0px 30px 40px 0px rgba(1, 11, 60, 0.1)',
  			shadow2: '0px 30px 60px 0px rgba(0, 4, 48, 0.3)',
  			card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					maxWidth: '65ch'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: 0
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: 0
  				}
  			},
  			// Add these new keyframes for the marquee animation
  			marquee: {
  				'0%': { transform: 'translateX(0%)' },
  				'100%': { transform: 'translateX(-100%)' }
  			},
  			'marquee-vertical': {
  				'0%': { transform: 'translateY(0%)' },
  				'100%': { transform: 'translateY(-100%)' }
  			},
  			'marquee-reverse': {
  				'0%': { transform: 'translateX(-100%)' },
  				'100%': { transform: 'translateX(0%)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			// Add these new animations
  			'marquee': 'marquee var(--duration, 40s) linear infinite',
  			'marquee-reverse': 'marquee-reverse var(--duration, 40s) linear infinite',
  			'marquee-vertical': 'marquee-vertical var(--duration, 40s) linear infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
  safelist: [
    'animate-marquee',
    'animate-marquee-reverse',
    'animate-marquee-vertical'
  ]
}
