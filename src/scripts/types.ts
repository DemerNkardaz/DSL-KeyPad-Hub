export type GitHubEndpoint = | 'releases/latest' | 'releases' | 'tags' | 'commits'
export type JsDelivrEndpoint =
	| '@main'
	| '@dev'

export type SourceMap = {
	github: GitHubEndpoint
	jsdelivr: JsDelivrEndpoint
}
