import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkExtractToc from 'remark-extract-toc'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import mdx from '@mdx-js/rollup'
import svgLoader from 'vite-svg-loader'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import rehypeShiki from '@shikijs/rehype'

import remarkReadingTime from 'remark-reading-time'
import { remarkReadingTimeExport } from './remarkReadingTimeExport'
import { remarkTypography } from './remarkTypography'

import ahk2Grammar from './ahk2.tmLanguage.json'

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
				[rehypeShiki, {
					theme: 'monokai',
					langs: [
						'javascript',
						'json',
						'jsonc',
						'ini',
						{
							...ahk2Grammar,
							name: 'ahk2',
							alias: ['autohotkey2']
						}
					]
				}],
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
