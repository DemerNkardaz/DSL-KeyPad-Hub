const allModules = import.meta.glob('./*/*.mdx', { eager: true })

export const articlesMeta = Object.entries(allModules).reduce((acc, [path, module]) => {
  const [, id, filename] = path.match(/\.\/(.+)\/(.+)\.mdx$/) ?? []
  const lang = filename
  if (!acc[id]) acc[id] = {}
  acc[id][lang] = (module as any).frontmatter
  return acc
}, {} as Record<string, Record<string, any>>)

export const articlesRegistry = [
	'getting-started',
	'getting-started',
	'getting-started',
	'getting-started',
	'getting-started',
]
