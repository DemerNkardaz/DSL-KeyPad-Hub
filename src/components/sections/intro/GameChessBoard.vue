<script setup lang="ts">
import { computed } from 'vue'
import { useChessGame } from '../../../scripts/composables/useChessGame'
import { useI18n } from 'vue-i18n'
import { baseUrl } from '../../../scripts/constants';

const { t } = useI18n()

const props = withDefaults(defineProps<{
  moveDelay?: number
  aiDepth?: number
  scale?: number
}>(), {
  moveDelay: 800,
  aiDepth: 3,
  scale: 1,
})

const {
  board,
  gameState,
  highlightMap,
  isPaused,
  aiEnabled,
  animatedMove,
  gameOver,
  gameOverStatus,
  gameWinner,
  restartTimeLeft,
  showRestartTimer,
  pieceToUnicode,
  handleCellClick,
  togglePause,
  toggleAI,
  reset,
  scale,
} = useChessGame({
  moveDelay: props.moveDelay,
  aiDepth: props.aiDepth,
  scale: props.scale,
})

const s = scale

function squareToCoords(square: string) {
  const file = square.charCodeAt(0) - 97
  const rank = 8 - parseInt(square[1])
  return { row: rank, col: file }
}

const animatedMoveStyle = computed(() => {
  if (!animatedMove.value) return {}

  const from = squareToCoords(animatedMove.value.from)
  const to = squareToCoords(animatedMove.value.to)
  const cellSize = 60 * s

  return {
    top: `${from.row * cellSize}px`,
    left: `${from.col * cellSize}px`,
    '--dx': `${(to.col - from.col) * cellSize}px`,
    '--dy': `${(to.row - from.row) * cellSize}px`,
  }
})

function boardClass(): string[] {
  const classes: string[] = []
  if (gameOver.value) classes.push('game-finished')

  if (gameOverStatus.value === 'checkmate') {
    if (gameWinner.value === 'b') {
      classes.push(aiEnabled.value ? 'won-blue' : 'lost')
    } else {
      classes.push(aiEnabled.value ? 'won-white' : 'won')
    }
  } else if (gameOverStatus.value === 'stalemate' || gameOverStatus.value === 'draw') {
    classes.push('draw')
  }

  return classes
}
</script>

<style lang="scss">
@use './GameChessBoard.scss';
</style>

<template>
  <div class="chess-container" :style="{ padding: `${20 * s}px` }">

    <!-- Доска -->
    <div class="chess-board-wrapper">
      <div
        class="chess-board"
        :class="boardClass()"
        :style="{
          gridTemplateColumns: `repeat(8, ${60 * s}px)`,
          gridTemplateRows: `repeat(8, ${60 * s}px)`,
          borderRadius: `${15 * s}px`,
          marginBottom: `${15 * s}px`,
        }"
      >
        <div
          v-for="cell in board"
          :key="cell.square"
          class="chess-cell"
          :class="[
            cell.isLight ? 'chess-cell-light' : 'chess-cell-dark',
            highlightMap.get(cell.square) ? `chess-cell-${highlightMap.get(cell.square)}` : '',
          ]"
          :style="{
            width: `${60 * s}px`,
            height: `${60 * s}px`,
            fontSize: `${40 * s}px`,
            cursor: !aiEnabled ? 'pointer' : 'default',
          }"
          @click="handleCellClick(cell.row, cell.col)"
        >
          <span
            v-if="cell.piece && !(animatedMove && (cell.square === animatedMove.from || cell.square === animatedMove.to))"
            class="chess-piece"
            :class="`chess-piece-${cell.piece.color === 'w' ? 'white' : 'black'}`"
            :style="{ fontSize: `${40 * s}px` }"
          >{{ pieceToUnicode(cell.piece.color, cell.piece.type) }}</span>
        </div>
      </div>

      <div
        v-if="animatedMove"
        class="chess-move-animation"
        :style="{
          ...animatedMoveStyle,
          width: `${60 * s}px`,
          height: `${60 * s}px`,
        }"
      >
        <span
          class="chess-piece chess-piece-animation"
          :class="`chess-piece-${animatedMove.piece.color === 'w' ? 'white' : 'black'}`"
          :style="{ fontSize: `${40 * s}px` }"
        >{{ pieceToUnicode(animatedMove.piece.color, animatedMove.piece.type) }}</span>
      </div>

      <!-- Оверлей окончания игры -->
      <div
        v-if="showRestartTimer"
        class="chess-on-board-status"
        :style="{ fontSize: `${3 * s}rem` }"
      >
        <div class="chess-timer">{{ restartTimeLeft }}…</div>
        <div class="chess-game-over-status" :style="{ fontSize: `${2 * s}rem` }">
          <template v-if="gameOverStatus === 'checkmate'">
            {{ t('chess.win') }} {{ gameWinner === 'w' ? t('chess.white') : t('chess.black') }}
          </template>
          <template v-else-if="gameOverStatus === 'stalemate'">
            {{ t('chess.stalemate') }}
          </template>
          <template v-else-if="gameOverStatus === 'draw'">
            {{ t('chess.draw') }}
          </template>
        </div>
      </div>
    </div>

    <!-- Инфо о ходе -->
    <div class="chess-info-container">
      <div class="chess-turn-info" :style="{ fontSize: `${20 * s}px` }">
        {{ t('chess.turn') }}
        {{ gameState.currentTurn === 'w' ? t('chess.white') : t('chess.black') }}
        {{ gameState.currentTurn === 'w' ? '♔' : '♚' }}
      </div>
      <div />
    </div>

    <!-- Кнопки -->
    <div class="chess-side-buttons-container">
      <button class="chess-btn chess-side-btn" @click="reset">
        <img class="invert" src="/images/flat_icons/flat_reload.svg" />
      </button>

      <button
        class="chess-btn chess-side-btn"
        :title="t('chess.start_warning')"
        @click="togglePause"
      >
        <img class="invert" :src="baseUrl + (isPaused ? 'images/flat_icons/flat_start.svg' : 'images/flat_icons/flat_pause.svg')"/>
      </button>

      <button
        class="chess-btn chess-side-btn"
        :class="aiEnabled ? 'chess-side-btn-allowed' : 'chess-side-btn-restricted'"
        :title="t('chess.ai_battleground')"
        @click="toggleAI"
      >
        <img class="invert" src="/images/flat_icons/flat_robot.svg" />
      </button>

			<a
        class="chess-btn chess-side-btn chess-side-btn-squared"
        href="https://home.unicode.org"
        target="_blank"
        :title="t('chess.unicode')"
      >
        <img src="/images/flat_icons/unicode_logo.svg" />
      </a>
    </div>

  </div>
</template>
