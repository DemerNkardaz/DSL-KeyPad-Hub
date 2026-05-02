<script setup lang="ts">
import { computed, ref } from 'vue'
import { useChessGame } from '../../../scripts/composables/useChessGame'
import { useI18n } from 'vue-i18n'
import { baseUrl } from '../../../scripts/constants';
import { useWindowSize } from '../../../scripts/composables/useWindowSize';
import Button from '../../ui/Button.vue'

const { t } = useI18n()
const { windowWidth } = useWindowSize()

const props = withDefaults(defineProps<{
	modelValue: boolean
	moveDelay?: number
	aiDepth?: number
	scale?: number
}>(), {
	moveDelay: 800,
	aiDepth: 3,
	scale: 1,
})

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
}>()

const isBoardVisible = computed({
	get: () => props.modelValue,
	set: (v: boolean) => emit('update:modelValue', v),
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
	get scale() { return props.scale - (windowWidth.value  <= 400 ? (props.scale * 0.1) : 0) },
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
		<div v-show="windowWidth <= 1050" class="btn-play transition-layer" :class="{ hidden: isBoardVisible }">
			<Button variant="action" @click="isBoardVisible = true">
				{{ t('play') }}
			</Button>
		</div>

	<div class="chess-container transition-layer" :class="{ hidden: !isBoardVisible }" :style="{ padding: `${20 * s}px` }">

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
						{{ t('games.win') }} {{ gameWinner === 'w' ? t('chess.white') : t('chess.black') }}
					</template>
					<template v-else-if="gameOverStatus === 'stalemate'">
						{{ t('games.stalemate') }}
					</template>
					<template v-else-if="gameOverStatus === 'draw'">
						{{ t('games.draw') }}
					</template>
				</div>
			</div>
		</div>

		<!-- Инфо о ходе -->
		<div class="chess-info-container">
			<div class="chess-turn-info" :style="{ fontSize: `${20 * s}px` }">
				{{ t('games.turn') }}
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

			<button class="chess-btn chess-side-btn" :title="t('games.start_warning')" @click="togglePause">
				<img class="invert" :src="baseUrl + (isPaused ? 'images/flat_icons/flat_start.svg' : 'images/flat_icons/flat_pause.svg')"/>
			</button>

			<button class="chess-btn chess-side-btn" :class="aiEnabled ? 'chess-side-btn-allowed' : 'chess-side-btn-restricted'" :title="t('chess.ai_battleground')" @click="toggleAI">
				<img class="invert" src="/images/flat_icons/flat_robot.svg" />
			</button>

			<a class="chess-btn chess-side-btn chess-side-btn-squared" href="https://home.unicode.org" target="_blank" :title="t('games.unicode')">
				<img src="/images/flat_icons/unicode_logo.svg" />
			</a>

			<!-- Скрытие доски -->
			<button v-if="windowWidth <= 1050" class="xiangqi-btn xiangqi-side-btn transition-layer"@click="isBoardVisible = false" :title="t('games.hide_board')">
				<img class="invert" src="/images/flat_icons/flat_visibility_2.svg" />
			</button>
		</div>

	</div>
</template>
