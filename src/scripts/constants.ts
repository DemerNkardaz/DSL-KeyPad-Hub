export const repositoryOwner = 'DemerNkardaz';
export const targetRepository = 'DSL-KeyPad';
export const url_github = `https://github.com/${repositoryOwner}/${targetRepository}`;
export const url_jsdelivr = `https://cdn.jsdelivr.net/gh/${repositoryOwner}/${targetRepository}`;
export const url_api_github = `https://api.github.com/repos/${repositoryOwner}/${targetRepository}`;
export const url_api_jsdelivr = `https://data.jsdelivr.com/v1/package/gh/${repositoryOwner}/${targetRepository}`;
export const url_download_release_github = (version: string) => `https://github.com/${repositoryOwner}/${targetRepository}/releases/download/${version}/dsl-keypad-${version}.zip`;
