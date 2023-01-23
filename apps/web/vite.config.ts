import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		react({
			babel: {
				parserOpts: {
					plugins: [
						[
							'decorators',
							{
								"decoratorsBeforeExport": true,
							},
						],
					],
				},
			},
		}),
		legacy({
			targets: ['defaults', 'not IE 11'],
		}),
	],
	resolve: {
		alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
	},
	server: {
		port: 3456,
		proxy: {
			'/api': {
				target: 'http://localhost:80',
				changeOrigin: true,
			},
		},
	},
	build: {
		outDir: '../server/build/public',
    emptyOutDir: true,
		rollupOptions: {
			output: {
				chunkFileNames: 'assets/js/[name]-[hash].js',
				entryFileNames: 'assets/js/[name]-[hash].js',
				assetFileNames: ({ name }) => {
					if (/\.(gif|jpe?g|png|svg)$/.test(name ?? ''))
						return 'assets/icon/[name]-[hash][extname]';
					if (/\.css$/.test(name ?? '')) return 'assets/css/[name]-[hash][extname]';
					if (/\.(mp3|mp4)$/.test(name ?? '')) return 'assets/media/[name]-[hash][extname]';
					return 'assets/[name]-[hash][extname]';
				},
			},
		},
	},
});
