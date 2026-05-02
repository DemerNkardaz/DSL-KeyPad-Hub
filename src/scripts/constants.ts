export const baseUrl = import.meta.env.BASE_URL || '/';
export const urlParams = new URLSearchParams(window.location.search);

export const repositoryOwner = 'DemerNkardaz';
export const targetRepository = 'DSL-KeyPad';
export const urlGithub = `https://github.com/${repositoryOwner}/${targetRepository}`;
export const urlJsdelivr = `https://cdn.jsdelivr.net/gh/${repositoryOwner}/${targetRepository}`;
export const urlApiGithub = `https://api.github.com/repos/${repositoryOwner}/${targetRepository}`;
export const urlApiJsdelivr = `https://data.jsdelivr.com/v1/package/gh/${repositoryOwner}/${targetRepository}`;
export const urlDownloadReleaseGithub = (version: string) => `https://github.com/${repositoryOwner}/${targetRepository}/releases/download/${version}/dsl-keypad-${version}.zip`;

const uaData = (navigator as unknown as {
  userAgentData?: { platform: string }
}).userAgentData

export const isWindows = uaData?.platform === 'Windows' || navigator.userAgent.includes('Windows')

export const pageWidth = window.innerWidth
export const pageHeight = window.innerHeight
