import type { ComposerTranslation } from 'vue-i18n'

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
