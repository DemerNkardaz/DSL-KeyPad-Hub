<script setup lang="ts">
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import { useWindowSize } from '../../../scripts/composables/useWindowSize'

type MobileFontSize = Record<number, number>

type ParsedSymbol = {
  symbol: string
  mirrorX: boolean
  mirrorY: boolean
}

type PlacedSymbol = {
  symbol: string
  mirrorX: boolean
  mirrorY: boolean
  x: number
  y: number
  fontSize: number
  rotation: number
  isCenter: boolean
}

type Ring = PlacedSymbol[]

const props = defineProps<{
  arguments: [
    rings: string[],
    baseFontSize: number,
    mobileFontSize?: MobileFontSize,
    baseRadius?: number
  ]
  animate?: [ringsToAnimate: number | number[], duration?: number | number[]]
}>()

const containerSize = 500
const centerX = containerSize / 2
const centerY = containerSize / 2

const ringRefs = ref<HTMLElement[]>([])

const { windowWidth } = useWindowSize()

const resolvedFontSize = computed(() => {
  const [, baseFontSize, mobileFontSize] = props.arguments
  if (!mobileFontSize) return baseFontSize

  const screenWidth = windowWidth.value
  const breakpoints = Object.keys(mobileFontSize).map(Number).sort((a, b) => b - a)

  let fontSize = baseFontSize
  for (const breakpoint of breakpoints) {
    if (screenWidth <= breakpoint) {
      fontSize = mobileFontSize[breakpoint]
    }
  }
  return fontSize
})

function parseSymbols(ring: string): ParsedSymbol[] {
  const symbols: ParsedSymbol[] = []
  const regex = /\[([xy]{1,2}m?):([^\]])\]|([\uD800-\uDBFF][\uDC00-\uDFFF]|.)/gu
  let match: RegExpExecArray | null

  while ((match = regex.exec(ring)) !== null) {
    if (match[1]) {
      symbols.push({
        symbol: match[2],
        mirrorX: match[1].includes('x'),
        mirrorY: match[1].includes('y'),
      })
    } else {
      symbols.push({ symbol: match[3], mirrorX: false, mirrorY: false })
    }
  }
  return symbols
}

const computedRings = computed<Ring[]>(() => {
  const [rings, , , baseRadiusProp = 0.75] = props.arguments
  const fontSize = resolvedFontSize.value

  const baseRadius = fontSize * baseRadiusProp
  const radiusStep = fontSize * 0.55

  const firstRingSymbols = parseSymbols(rings[0])
  const firstRingIsCenter = firstRingSymbols.length === 1

  return rings.map((ring, ringIndex) => {
    const parsedSymbols = parseSymbols(ring)
    const symbolCount = parsedSymbols.length

    if (ringIndex === 0 && firstRingIsCenter) {
      const { symbol, mirrorX, mirrorY } = parsedSymbols[0]
      return [{
        symbol, mirrorX, mirrorY,
        x: 0, y: 0, fontSize, rotation: 0, isCenter: true,
      }]
    }

    const radiusIndex = ringIndex - (firstRingIsCenter ? 1 : 0)
    const radius = baseRadius + radiusIndex * radiusStep
    const symbolFontSize = fontSize * (1 / Math.sqrt(symbolCount)) * (1 + ringIndex * 0.15)
    const angleStep = 360 / symbolCount

    return parsedSymbols.map(({ symbol, mirrorX, mirrorY }, symbolIndex) => {
      const angle = symbolIndex * angleStep
      const angleRad = (angle - 90) * Math.PI / 180

      return {
        symbol, mirrorX, mirrorY,
        x: radius * Math.cos(angleRad),
        y: radius * Math.sin(angleRad),
        fontSize: symbolFontSize,
        rotation: angle,
        isCenter: false,
      }
    })
  })
})

function getSymbolTransform(item: PlacedSymbol): string {
  const mirror = item.mirrorX && item.mirrorY
    ? 'scale(-1, -1)'
    : item.mirrorX
      ? 'scale(-1, 1)'
      : item.mirrorY
        ? 'scale(1, -1)'
        : ''

  if (item.isCenter) return `translate(-50%, -50%) ${mirror}`
  return `translate(-50%, -50%) rotate(${item.rotation}deg) ${mirror}`
}

async function applyAnimations() {
  await nextTick()

  if (!props.animate) return

  const [ringsToAnimate, duration = 10] = props.animate
  const indices = Array.isArray(ringsToAnimate) ? ringsToAnimate : [ringsToAnimate]
  const durations = Array.isArray(duration) ? duration : [duration]

  indices.forEach((ringIndex, i) => {
    const el = ringRefs.value[ringIndex]
    if (!el) return

    const dur = durations[i] !== undefined ? durations[i] : durations[0]
    const absDur = Math.abs(dur)
    const direction = dur < 0 ? 'reverse' : 'normal'

    el.style.animation = `generated-ring-rotate ${absDur}s linear infinite ${direction}`
  })
}

function clearAnimations() {
  ringRefs.value.forEach(el => {
    if (el) el.style.animation = 'none'
  })
}

onMounted(() => applyAnimations())

watch(() => props.animate, () => {
  clearAnimations()
  applyAnimations()
}, { deep: true })

watch(computedRings, () => {
  clearAnimations()
  applyAnimations()
})
</script>

<template>
  <div class="generated-ring-wrapper">
    <div
      v-for="(ring, ringIndex) in computedRings"
      :key="ringIndex"
      :ref="(el) => { if (el) ringRefs[ringIndex] = el as HTMLElement }"
      class="generated-ring-container"
      :style="{
        position: 'absolute',
        left: `${centerX}px`,
        top: `${centerY}px`,
        width: '0',
        height: '0',
        transformOrigin: 'center center',
      }"
    >
      <div
        v-for="(item, symbolIndex) in ring"
        :key="symbolIndex"
        class="generated-ring-symbol"
        :style="{
          position: 'absolute',
          fontSize: `${item.fontSize}px`,
          lineHeight: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          left: item.isCenter ? '0' : `${item.x}px`,
          top: item.isCenter ? '0' : `${item.y}px`,
          transform: getSymbolTransform(item),
        }"
      >{{ item.symbol }}</div>
    </div>
  </div>
</template>

<style>
.generated-ring-wrapper {
  position: relative;
  width: 500px;
  height: 500px;
  overflow: visible;
}

@keyframes generated-ring-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
