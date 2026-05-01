import { urlApiGithub } from "./constants";

const CACHE_KEY = 'latestRelease'
const CACHE_TTL = 1000 * 60 * 30 // 30 минут

export async function fetchRepositoryData<T = unknown>(endpoint: 'releases/latest' | 'releases' | 'tags' | 'commits'): Promise<T> {
	const url = `${urlApiGithub}/${endpoint}`

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


export async function getLatestRelease<T = unknown>(): Promise<T | null> {
	const cached = localStorage.getItem(CACHE_KEY)

	if (cached) {
		const parsed = JSON.parse(cached)
		const isFresh = Date.now() - parsed.timestamp < CACHE_TTL

		if (isFresh) {
			return parsed.data as T
		}
	}

	try {
		const data = await fetchRepositoryData<T>('releases/latest')

		localStorage.setItem(
			CACHE_KEY,
			JSON.stringify({
				data,
				timestamp: Date.now()
			})
		)

		return data
	} catch (err) {
		console.error('Failed to fetch latest release:', err)

		if (cached) {
			return JSON.parse(cached).data as T
		}

		return null
	}
}
