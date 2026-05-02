<script setup lang="ts">
import { computed, ref } from 'vue'
import { useXiangqiGame } from '../../../scripts/composables/useXiangqiGame'
import { useI18n } from 'vue-i18n'
import { baseUrl } from '../../../scripts/constants'
import { useWindowSize } from '../../../scripts/composables/useWindowSize'
import Button from '../../ui/Button.vue'

const { t } = useI18n()
const { windowWidth } = useWindowSize()

const props = withDefaults(defineProps<{
	modelValue: boolean
	moveDelay?: number
	aiDepth?: number
	scale?: number
}>(), {
	modelValue: false,
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
	squareToCoords,
	handleCellClick,
	togglePause,
	toggleAI,
	reset,
	scale,
} = useXiangqiGame({
	moveDelay: props.moveDelay,
	aiDepth: props.aiDepth,
	// scale: props.scale,
	get scale() { return props.scale - (windowWidth.value  <= 400 ? (props.scale * 0.1) : 0) },
})

const s = scale

// ── Анимация движения фигуры ─────────────────────────────────────────────────
// Размер клетки сянци — 55px (в отличие от 60px у шахмат)

const CELL_SIZE = 55

const animatedMoveStyle = computed(() => {
	if (!animatedMove.value) return {}

	const from = squareToCoords(animatedMove.value.from)
	const to   = squareToCoords(animatedMove.value.to)
	const cell = CELL_SIZE * s

	return {
		top:   `${from.row * cell}px`,
		left:  `${from.col * cell}px`,
		'--dx': `${(to.col - from.col) * cell}px`,
		'--dy': `${(to.row - from.row) * cell}px`,
	}
})

// ── Классы доски (победа / ничья) ─────────────────────────────────────────────

function boardClass(): string[] {
	const classes: string[] = []
	if (gameOver.value) classes.push('game-finished')

	if (gameOverStatus.value === 'checkmate' || gameOverStatus.value === 'stalemate') {
		if (gameWinner.value === 'b') {
			// Чёрные победили
			classes.push(aiEnabled.value ? 'won-blue' : 'lost')
		} else {
			// Красные победили
			classes.push(aiEnabled.value ? 'won-red' : 'won')
		}
	} else if (gameOverStatus.value === 'draw') {
		classes.push('draw')
	}

	return classes
}

// ── Текущий ход: иконка и цветовые классы кнопки-индикатора ─────────────────

const turnPieceUnicode = computed(() =>
	gameState.value.currentTurn === 'r' ? '\uD83E\uDE60' : '\uD83E\uDE67'
)

const turnWrapperClass = computed(() =>
	gameState.value.currentTurn === 'r'
		? 'xiangqi-piece-wrapper-red'
		: 'xiangqi-piece-wrapper-black'
)

const turnPieceClass = computed(() =>
	gameState.value.currentTurn === 'r'
		? 'xiangqi-piece-red'
		: 'xiangqi-piece-black'
)
</script>

<style lang="scss">
@use './GameXiangqiBoard.scss';
</style>

<template>
		<div v-show="windowWidth <= 1050" class="btn-play transition-layer" :class="{ hidden: isBoardVisible }">
			<Button variant="action" @click="isBoardVisible = true">
				{{ t('play') }}
			</Button>
		</div>

		<div class="xiangqi-container transition-layer" :class="{ hidden: !isBoardVisible }" :style="{ padding: `${20 * s}px` }">

		<!-- Доска -->
		<div class="xiangqi-board-wrapper">
			<div
				class="xiangqi-board"
				:class="boardClass()"
				:style="{
					gridTemplateColumns: `repeat(9, ${CELL_SIZE * s}px)`,
					gridTemplateRows:    `repeat(10, ${CELL_SIZE * s}px)`,
					borderRadius:         `${15 * s}px`,
					marginBottom:         `${15 * s}px`,
				}"
			>
				<div
					v-for="cell in board"
					:key="cell.square"
					class="xiangqi-cell"
					:class="[
						highlightMap.get(cell.square) ? `xiangqi-cell-${highlightMap.get(cell.square)}` : '',
					]"
					:style="{
						width:     `${CELL_SIZE * s}px`,
						height:    `${CELL_SIZE * s}px`,
						fontSize:  `${35 * s}px`,
						cursor:    !aiEnabled ? 'pointer' : 'default',
					}"
					@click="handleCellClick(cell.row, cell.col)"
				>
					<!--
						Фигура обёрнута в pieceWrapper — это специфика сянци,
						отсутствующая в шахматах. Wrapper несёт цветовой класс кружка.
					-->
					<div
						v-if="cell.piece && !(animatedMove && (cell.square === animatedMove.from || cell.square === animatedMove.to))"
						class="xiangqi-piece-wrapper"
						:class="`xiangqi-piece-wrapper-${cell.piece.color === 'r' ? 'red' : 'black'}`"
					>
						<span
							class="xiangqi-piece"
							:class="`xiangqi-piece-${cell.piece.color === 'r' ? 'red' : 'black'}`"
							:style="{ fontSize: `${35 * s}px` }"
						>{{ pieceToUnicode(cell.piece.color, cell.piece.type) }}</span>
					</div>
				</div>
			</div>

			<!-- Анимация хода -->
			<div
				v-if="animatedMove"
				class="xiangqi-move-animation"
				:style="{
					...animatedMoveStyle,
					width:  `${CELL_SIZE * s}px`,
					height: `${CELL_SIZE * s}px`,
				}"
			>
				<div
					class="xiangqi-piece-wrapper xiangqi-piece-animation"
					:class="`xiangqi-piece-wrapper-${animatedMove.piece.color === 'r' ? 'red' : 'black'}`"
				>
					<span
						class="xiangqi-piece"
						:class="`xiangqi-piece-${animatedMove.piece.color === 'r' ? 'red' : 'black'}`"
						:style="{ fontSize: `${35 * s}px` }"
					>{{ pieceToUnicode(animatedMove.piece.color, animatedMove.piece.type) }}</span>
				</div>
			</div>

			<!-- Оверлей окончания игры -->
			<div
				v-if="showRestartTimer"
				class="xiangqi-on-board-status"
				:style="{ fontSize: `${3 * s}rem` }"
			>
				<div class="xiangqi-timer">{{ restartTimeLeft }}…</div>
				<div class="xiangqi-game-over-status" :style="{ fontSize: `${2 * s}rem` }">
					<template v-if="gameOverStatus === 'checkmate'">
						{{ t('games.win') }}
						{{ gameWinner === 'r' ? t('xiangqi.red') : t('xiangqi.black') }}
					</template>
					<template v-else-if="gameOverStatus === 'stalemate'">
						{{ t('games.stalemate') }}
						{{ gameWinner === 'r' ? t('xiangqi.red') : t('xiangqi.black') }}
					</template>
					<template v-else-if="gameOverStatus === 'draw'">
						{{ t('games.draw') }}
					</template>
				</div>
			</div>
		</div>

		<!-- Кнопки управления -->
		<div class="xiangqi-side-buttons-container">

			<!-- Сброс -->
			<button class="xiangqi-btn xiangqi-side-btn" @click="reset">
				<img class="invert" src="/images/flat_icons/flat_reload.svg" />
			</button>

			<!-- Старт / Пауза -->
			<button class="xiangqi-btn xiangqi-side-btn" :title="t('games.start_warning')" @click="togglePause">
				<img class="invert" :src="baseUrl + (isPaused ? 'images/flat_icons/flat_start.svg' : 'images/flat_icons/flat_pause.svg')"/>
			</button>

			<!-- AI-режим -->
			<button class="xiangqi-btn xiangqi-side-btn" :class="aiEnabled ? 'xiangqi-side-btn-allowed' : 'xiangqi-side-btn-restricted'" :title="t('xiangqi.ai_battleground')" @click="toggleAI">
				<img class="invert" src="/images/flat_icons/flat_robot.svg" />
			</button>

			<!--
				Кнопка-индикатор текущего хода.
				Специфична для сянци: вместо текстового chess-turn-info
				используется интерактивный элемент с иконкой фигуры и цветом команды.
				title выводит читаемое описание.
			-->
			<button class="xiangqi-btn xiangqi-side-btn xiangqi-piece-turn-wrapper" :class="turnWrapperClass" :title="`${t('games.turn')} ${gameState.currentTurn === 'r' ? t('xiangqi.red') : t('xiangqi.black')}`" disabled>
				<span class="xiangqi-piece" :class="turnPieceClass" :style="{ fontSize: `${42 * s}px` }">{{ turnPieceUnicode }}</span>
			</button>

			<!-- Ссылка на Unicode -->
			<a class="xiangqi-btn xiangqi-side-btn xiangqi-side-btn-squared" href="https://home.unicode.org" target="_blank" :title="t('games.unicode')">
				<img src="/images/flat_icons/unicode_logo.svg" />
			</a>

			<!-- Скрытие доски -->
			<button v-if="windowWidth <= 1050" class="xiangqi-btn xiangqi-side-btn transition-layer"@click="isBoardVisible = false" :title="t('games.hide_board')">
				<img class="invert" src="/images/flat_icons/flat_visibility_2.svg" />
			</button>
		</div>

	</div>
</template>
