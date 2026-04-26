import { repositoryOwner, targetRepository } from "./constants";
import type { GitHubEndpoint } from "./types";

export async function fetchRepositoryData<T = unknown>(endpoint: GitHubEndpoint): Promise<T> {
	const apiUrl = `https://api.github.com/repos/${repositoryOwner}/${targetRepository}/${endpoint}`;

	try {

		const response = await fetch(apiUrl);

		if (!response.ok) {
			throw new Error(`GitHub API error\nURL: ${apiUrl}\nStatus: ${response.status} ${response.statusText}`);
		}

		return (await response.json()) as T;
	} catch (err) {
		throw new Error(`Network or parsing error while fetching ${apiUrl}\n${String(err)}`);
	}
}
