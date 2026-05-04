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

export const articlesRegistry = [
  'getting-started',
  'user-files',
  'mod-making',
]
