import fs from 'node:fs'

const xml = fs.readFileSync('./DSL-KeyPad.tmTheme', 'utf-8')

// ── helpers ──────────────────────────────────────────────────────────────────

function extractString(key, text) {
  return text.match(new RegExp(`<key>${key}<\\/key>\\s*<string>([\\s\\S]*?)<\\/string>`))?.[1] ?? null
}

function parseDict(block) {
  const result = {}
  const re = /<key>([\s\S]*?)<\/key>\s*<string>([\s\S]*?)<\/string>/g
  for (const m of block.matchAll(re)) result[m[1].trim()] = m[2].trim()
  return result
}

function normalizeFontStyle(raw) {
  const v = raw.trim().replace(/\s+/g, ' ')
  return v.length ? v : null
}

// ── 1. Name ──────────────────────────────────────────────────────────────────
const name = extractString('name', xml) ?? 'custom-theme'

// ── 2. Global editor colors ───────────────────────────────────────────────────
const globalBlockMatch = xml.match(
  /<array>\s*<dict>\s*<key>settings<\/key>\s*<dict>([\s\S]*?)<\/dict>\s*<\/dict>/
)
const globalSettings = globalBlockMatch ? parseDict(globalBlockMatch[1]) : {}

const colors = {}
const colorKeyMap = {
  background:    'editor.background',
  foreground:    'editor.foreground',
  caret:         'editorCursor.foreground',
  selection:     'editor.selectionBackground',
  lineHighlight: 'editor.lineHighlightBackground',
  invisibles:    'editorWhitespace.foreground',
}
for (const [tmKey, vscKey] of Object.entries(colorKeyMap)) {
  if (globalSettings[tmKey]) colors[vscKey] = globalSettings[tmKey]
}

// ── 3. Split <array> into top-level <dict> chunks ───────────────────────────
const arrayContent = xml.match(/<array>([\s\S]*)<\/array>/)?.[1] ?? ''

function splitTopLevelDicts(text) {
  const dicts = []
  let depth = 0, start = -1, i = 0
  while (i < text.length) {
    if (text.startsWith('<dict>', i)) {
      if (depth === 0) start = i
      depth++; i += 6
    } else if (text.startsWith('</dict>', i)) {
      depth--
      if (depth === 0 && start !== -1) { dicts.push(text.slice(start, i + 7)); start = -1 }
      i += 7
    } else { i++ }
  }
  return dicts
}

// First dict = global settings, skip it
const tokenDicts = splitTopLevelDicts(arrayContent).slice(1)

// ── 4. Parse token rules ─────────────────────────────────────────────────────
const tokenColors = []

for (const block of tokenDicts) {
  const scopeMatch = block.match(/<key>scope<\/key>\s*<string>([\s\S]*?)<\/string>/)
  if (!scopeMatch) continue
  const scope = scopeMatch[1].trim()

  // Only look inside the nested settings dict, not the outer block
  const settingsBlock = block.match(/<key>settings<\/key>\s*<dict>([\s\S]*?)<\/dict>/)?.[1] ?? ''

  const fg   = settingsBlock.match(/<key>foreground<\/key>\s*<string>([\s\S]*?)<\/string>/)?.[1]?.trim()
  const bg   = settingsBlock.match(/<key>background<\/key>\s*<string>([\s\S]*?)<\/string>/)?.[1]?.trim()
  const font = settingsBlock.match(/<key>fontStyle<\/key>\s*<string>([\s\S]*?)<\/string>/)?.[1]

  const settings = {}
  if (fg) settings.foreground = fg
  if (bg) settings.background = bg
  const fs_ = font != null ? normalizeFontStyle(font) : null
  if (fs_) settings.fontStyle = fs_

  tokenColors.push({ scope, settings })
}

// ── 5. Write ──────────────────────────────────────────────────────────────────
const shikiTheme = { name, type: 'dark', colors, tokenColors }
fs.writeFileSync('./DSL-KeyPad.json', JSON.stringify(shikiTheme, null, 2), 'utf-8')
console.log('Converted → DSL-KeyPad.json')
