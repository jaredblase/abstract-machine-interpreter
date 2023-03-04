/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{svelte,css}",
	],
	darkMode: 'class',
	theme: {
		extend: {},
	},
	plugins: [
		require('tailwind-scrollbar'),
		require('tailwindcss-global-dark')
	],
}
