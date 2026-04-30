import type { ComposerTranslation } from 'vue-i18n'
import { baseUrl, urlDownloadReleaseGithub } from './constants'

export function formatTitle(source: string, t: ComposerTranslation): string {
	const regex = /^(.*?)@([\d.]+)(?:\s*([^\s]+))?$/
	const match = source.match(regex)

	if (match) {
		const name = match[1].trim()
		const version = match[2].trim()
		const statusSymbol = match[3]

		const status = statusSymbol ? ` ${t(`status_titles.${statusSymbol}`) || statusSymbol}` : ''

		return `${name} ${version}${status}`
	}

	return source
}

export function getDownloadUrl(version: string): string {
	return urlDownloadReleaseGithub(version)
}

export function pathWithBase(path: string): string {
	return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

export function parseToMarkup(rawString: string): string {
	let html = rawString
		.replace(/\[([^\]@]+)@([^\]]+)\]/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
	return html
}

export function randomObjectKey<T extends Record<string, unknown>>(obj: T): keyof T {
    const keys = Object.keys(obj) as (keyof T)[]
    return keys[Math.floor(Math.random() * keys.length)]
}
