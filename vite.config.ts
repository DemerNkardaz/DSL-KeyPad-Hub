import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkExtractToc from 'remark-extract-toc'
import rehypeExternalLinks from 'rehype-external-links'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import mdx from '@mdx-js/rollup'
import svgLoader from 'vite-svg-loader'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'

import remarkReadingTime from 'remark-reading-time'
import { remarkReadingTimeExport } from './remarkReadingTimeExport'
import { remarkTypography } from './remarkTypography'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		{ enforce: 'pre', ...mdx({
			jsxImportSource: 'vue',
			remarkPlugins: [
				remarkFrontmatter,
				[remarkMdxFrontmatter, { name: 'frontmatter' }],
				remarkGfm,
				[remarkExtractToc, { name: 'toc', keys: ['value', 'depth', 'data'] }],
				remarkReadingTime,
				remarkReadingTimeExport,
				remarkTypography,
			],
			rehypePlugins: [
				rehypeSlug,
				rehypeAutolinkHeadings,
				[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
				rehypePrettyCode,
			]
		}), },
		vue(),
		vueJsx(),
		svgLoader(),
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
