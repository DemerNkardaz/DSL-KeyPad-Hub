import { repositorySources } from "./constants";

export async function fetchRepositoryData<T = unknown>(endpoint: 'releases/latest' | 'releases' | 'tags' | 'commits'): Promise<T> {
	const base = repositorySources['api_github']
	const url = `${base}/${endpoint}`

	try {
		const response = await fetch(url)

		if (!response.ok) {
			throw new Error(
				`GitHub API error\nURL: ${url}\nStatus: ${response.status} ${response.statusText}`
			)
		}

		return (await response.json()) as T
	} catch (err) {
		throw new Error(
			`Network or parsing error while fetching ${url}\n${String(err)}`
		)
	}
}
