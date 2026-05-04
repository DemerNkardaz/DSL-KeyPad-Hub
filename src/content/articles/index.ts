const allModules = import.meta.glob('./*/*.mdx', { eager: true })

export const articlesModules = allModules as Record<string, any>

export const articlesMeta = Object.entries(allModules).reduce((acc, [path, module]) => {
	const match = path.match(/\.\/(.+)\/(.+)\.mdx$/)
	if (!match) return acc

	const [, id, filename] = match
	const lang = filename

	if (!acc[id]) acc[id] = {}

	acc[id][lang] = (module as any).frontmatter

	return acc
}, {} as Record<string, Record<string, any>>)

export const articlesRegistry = Object.keys(articlesMeta).sort((a, b) => {
	const getPriority = (id: string): number | undefined =>
		Object.values(articlesMeta[id]).find(meta => meta?.priority != null)?.priority

	const pa = getPriority(a)
	const pb = getPriority(b)

	if (pa == null && pb == null) return 0
	// Без priority идут в конец
	if (pa == null) return 1
	if (pb == null) return -1
	return pa - pb
})
