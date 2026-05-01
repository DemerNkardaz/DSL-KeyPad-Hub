import { ref, toValue, type MaybeRef } from 'vue'
import { backgroundRandomCharacters } from '../data/random_character'

interface PlacedChar {
  char: string
  x: number
  y: number
  fontSize: number
  rotation: number
}

export function useScatteredCharacters(
  characters: MaybeRef<string[] | string | undefined> = backgroundRandomCharacters
) {
  const placedChars = ref<PlacedChar[]>([])

  function scatter() {
    const resolved = toValue(characters) || backgroundRandomCharacters
    const source = Array.isArray(resolved)
      ? resolved[Math.floor(Math.random() * resolved.length)]
      : resolved

    const chars = [...source]
    const totalChars = chars.length
    const positions: { x: number; y: number; radius: number }[] = []
    const minDistanceBase = 8
    const maxAttempts = 100

    function hasCollision(x: number, y: number, fontSize: number): boolean {
      const charRadius = fontSize * 1.2
      for (const pos of positions) {
        const dx = x - pos.x
        const dy = y - pos.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < minDistanceBase + charRadius + pos.radius) return true
      }
      return false
    }

    function generatePosition(
      index: number,
      fontSize: number,
      attemptNumber: number
    ): { x: number; y: number } {
      const padding = fontSize * 2
      let x: number, y: number

      if (attemptNumber < maxAttempts * 0.6) {
        const gridSize = Math.ceil(Math.sqrt(totalChars * 1.5))
        const cellWidth = (100 - padding * 2) / gridSize
        const cellHeight = (100 - padding * 2) / gridSize
        const cellIndex = (index * 7 + attemptNumber * 3) % (gridSize * gridSize)
        const cellRow = Math.floor(cellIndex / gridSize)
        const cellCol = cellIndex % gridSize
        x = padding + cellCol * cellWidth + cellWidth / 2 + (Math.random() - 0.5) * cellWidth * 0.8
        y = padding + cellRow * cellHeight + cellHeight / 2 + (Math.random() - 0.5) * cellHeight * 0.8
      } else if (attemptNumber < maxAttempts * 0.85) {
        const rings = Math.ceil(Math.sqrt(totalChars / 2))
        const angleOffset = (index * 137.5 + attemptNumber * 45) % 360
        const ringIndex = (index + attemptNumber) % rings
        const angle = (angleOffset * Math.PI) / 180
        const radius = 10 + ((ringIndex + 1) / rings) * 45
        x = 50 + radius * Math.cos(angle)
        y = 50 + radius * Math.sin(angle)
      } else {
        x = padding + Math.random() * (100 - padding * 2)
        y = padding + Math.random() * (100 - padding * 2)
      }

      return {
        x: Math.max(padding, Math.min(100 - padding, x)),
        y: Math.max(padding, Math.min(100 - padding, y)),
      }
    }

    function resolvePosition(index: number, fontSize: number) {
      const charRadius = fontSize * 1.2

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const pos = generatePosition(index, fontSize, attempt)
        if (!hasCollision(pos.x, pos.y, fontSize)) {
          positions.push({ ...pos, radius: charRadius })
          return pos
        }
      }

      const padding = fontSize * 1.5
      for (let attempt = 0; attempt < 50; attempt++) {
        const pos = {
          x: padding + Math.random() * (100 - padding * 2),
          y: padding + Math.random() * (100 - padding * 2),
        }
        if (!hasCollision(pos.x, pos.y, fontSize * 0.8)) {
          positions.push({ ...pos, radius: charRadius })
          return pos
        }
      }

      const pos = { x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 }
      positions.push({ ...pos, radius: charRadius })
      return pos
    }

    placedChars.value = chars.map((char, index) => {
      const fontSize = 2 + Math.random() * 2
      const position = resolvePosition(index, fontSize)
      return {
        char,
        x: position.x,
        y: position.y,
        fontSize,
        rotation: Math.random() * 360,
      }
    })
  }

  scatter()

  return { placedChars, scatter }
}
