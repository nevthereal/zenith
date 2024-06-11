import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {}
	},
	daisyui: {
		themes: [
			{
				supernova: {
					primary: '#5a67d8', // a deep indigo
					secondary: '#ecc94b', // a bright yellow
					accent: '#38b2ac', // a teal color
					neutral: '#2d3748', // a dark gray
					'base-100': '#1a202c', // almost black, deep dark gray

					'--rounded-box': '0.25rem', // subtle border radius for a slightly rounded look
					'--rounded-btn': '0.25rem', // subtle border radius for buttons
					'--rounded-badge': '0.25rem', // subtle border radius for badges
					'--animation-btn': '0s', // no animation for button clicks
					'--animation-input': '0s', // no animation for inputs
					'--btn-focus-scale': '1', // no scale transform on button focus
					'--border-btn': '4px', // very thick border for buttons
					'--tab-border': '4px', // very thick border for tabs
					'--tab-radius': '0.25rem' // subtle border radius for tabs
				}
			}
		]
	},

	plugins: [require('@tailwindcss/typography'), require('daisyui')]
} as Config;
