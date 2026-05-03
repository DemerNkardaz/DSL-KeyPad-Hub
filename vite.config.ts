import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import mdx from '@mdx-js/rollup'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		{ enforce: 'pre', ...mdx({
			jsxImportSource: 'vue',
			remarkPlugins: [
				remarkFrontmatter,
				[remarkMdxFrontmatter, { name: 'frontmatter' }],
			]
		}), },
		vue(),
		vueJsx(),
	],
	base: '/DSL-KeyPad-Docs/',
	server: {
		open: true
	},
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `@use "@/styles/variables.scss" as *;`
			}
		}
	}
})
