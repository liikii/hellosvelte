import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(),
	],
	css: {
		preprocessorOptions: {
			scss: {
				silenceDeprecations: [
					'color-functions',
					'import',               // @import 规则警告
					'legacy-js-api',        // legacy JS API warning
				],
				quietDeps: true,
			},
		},
  	},
	server: {
		proxy: {
			'/api': {
				target: 'http://127.0.0.1:3000',
				changeOrigin: true,
				// rewrite: (path) => path.replace(/^\/api/, '/api')
			}
		}
	},
});
