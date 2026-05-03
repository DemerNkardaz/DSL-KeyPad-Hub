import { ref, computed, onUnmounted } from 'vue'
import type {
  XiangqiOptions,
  XiangqiBoardCell,
  XiangqiGameState,
  XiangqiHighlightClass,
} from '../types/xiangqi'

// ── Типизация внешней библиотеки xiangqi.min.js ──────────────────────────────
// Библиотека подключается как глобальный класс Xiangqi.
// Интерфейс намеренно минимален — только то, что реально используется.

interface XiangqiPieceRaw {
  type: string
  color: 'r' | 'b'
}

interface XiangqiMoveVerbose {
  from: string
  to: string
  piece: string
  color: 'r' | 'b'
  captured?: string
  flags: string
  san: string
}

interface XiangqiLib {
  fen(): string
  board(): (XiangqiPieceRaw | null)[][]
  turn(): 'r' | 'b'
  get(square: string): XiangqiPieceRaw | null
  moves(opts?: { square?: string; verbose?: boolean }): string[] | XiangqiMoveVerbose[]
  move(move: string | { from: string; to: string }): XiangqiMoveVerbose | null
  undo(): XiangqiMoveVerbose | null
  reset(): void
  game_over(): boolean
  in_checkmate(): boolean
  in_stalemate(): boolean
  in_draw(): boolean
  load(fen: string): boolean
}

declare const Xiangqi: new () => XiangqiLib

// ── Вспомогательная функция: создать экземпляр с нужным FEN ──────────────────

function createXiangqiFromFen(fen: string): XiangqiLib {
  const g = new Xiangqi()
  g.load(fen)
  return g
}

// ─────────────────────────────────────────────────────────────────────────────

export function useXiangqiGame(options: XiangqiOptions = {}) {
  const config = {
    moveDelay: options.moveDelay ?? 800,
    aiDepth: options.aiDepth ?? 3,
    scale: options.scale ?? 1,
  }

  // Реактивный экземпляр — для темплейта
  const game = ref<XiangqiLib>(new Xiangqi())
  // Нереактивный экземпляр — только для AI-расчётов
  let aiGame: XiangqiLib = new Xiangqi()

  const gameOver = ref(false)
  const isPaused = ref(true)
  const aiEnabled = ref(true)
  const selectedSquare = ref<string | null>(null)
  const lastMove = ref<{ from: string; to: string } | null>(null)
  const animatedMove = ref<{ from: string; to: string; piece: XiangqiPieceRaw } | null>(null)
  const isAnimating = ref(false)
  const restartTimeLeft = ref(10)
  const showRestartTimer = ref(false)
  const gameOverStatus = ref<XiangqiGameState['status'] | null>(null)
  const gameWinner = ref<'r' | 'b' | null>(null)

  // highlightMap — явный ref, пересчитывается только при выборе/сбросе фигуры
  const highlightMap = ref<Map<string, XiangqiHighlightClass>>(new Map())

  let moveTimeout: ReturnType<typeof setTimeout> | null = null
  let restartInterval: ReturnType<typeof setInterval> | null = null

  // ─── Unicode фигуры ───────────────────────────────────────────────────────

  const unicodePieces: Record<string, string> = {
    rk: '\uD83E\uDE60', ra: '\uD83E\uDE61', rb: '\uD83E\uDE62',
    rn: '\uD83E\uDE63', rr: '\uD83E\uDE64', rc: '\uD83E\uDE65', rp: '\uD83E\uDE66',
    bk: '\uD83E\uDE67', ba: '\uD83E\uDE68', bb: '\uD83E\uDE69',
    bn: '\uD83E\uDE6A', br: '\uD83E\uDE6B', bc: '\uD83E\uDE6C', bp: '\uD83E\uDE6D',
  }

  function pieceToUnicode(color: 'r' | 'b', type: string): string {
    return unicodePieces[color + type.toLowerCase()] ?? ''
  }

  // ─── Нотация (сянци): col-буква + row-цифра, например 'e0' ───────────────

  function getSquareNotation(row: number, col: number): string {
    return String.fromCharCode(97 + col) + row
  }

  function squareToCoords(square: string): { row: number; col: number } {
    return {
      col: square.charCodeAt(0) - 97,
      row: parseInt(square.substring(1)),
    }
  }

  // ─── Анимация и коммит состояния ──────────────────────────────────────────

  const animationDuration = 400

  function commitGameState() {
    game.value = createXiangqiFromFen(game.value.fen())
    updateBoard()
  }

  function queueMoveAnimation(
    from: string,
    to: string,
    piece: XiangqiPieceRaw,
  ): boolean {
    if (isAnimating.value) return false
    isAnimating.value = true
    animatedMove.value = { from, to, piece }
    updateHighlightMap(null)

    setTimeout(() => {
      game.value = createXiangqiFromFen(game.value.fen())
      updateBoard()
      isAnimating.value = false
      animatedMove.value = null
    }, animationDuration)

    return true
  }

  // ─── Состояние игры ───────────────────────────────────────────────────────

  const gameState = computed<XiangqiGameState>(() => {
    const g = game.value
    let status: XiangqiGameState['status'] = 'playing'
    let winner: 'r' | 'b' | null = null

    if (g.in_checkmate()) {
      status = 'checkmate'
      // Тот, кто сейчас должен ходить — проиграл
      winner = g.turn() === 'r' ? 'b' : 'r'
    } else if (g.in_stalemate()) {
      status = 'stalemate'
      winner = g.turn() === 'r' ? 'b' : 'r'
    } else if (g.in_draw()) {
      status = 'draw'
    }

    return { status, winner, currentTurn: g.turn() }
  })

  // ─── Доска ────────────────────────────────────────────────────────────────

  const board = ref<XiangqiBoardCell[]>([])

  function buildBoard(): XiangqiBoardCell[] {
    const cells: XiangqiBoardCell[] = []
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 9; col++) {
        const square = getSquareNotation(row, col)
        const raw = game.value.get(square)
        cells.push({
          row,
          col,
          square,
          piece: raw ? { type: raw.type, color: raw.color } : null,
        })
      }
    }
    return cells
  }

  function updateBoard() {
    board.value = buildBoard()
  }

  updateBoard()

  // ─── Атаки (специфика сянци) ──────────────────────────────────────────────

  /**
   * Возвращает множество клеток, атакуемых фигурой на (row, col).
   * Логика атак полностью повторяет AutoXiangqi.getSquareAttacksXiangqi.
   */
  function getSquareAttacks(row: number, col: number, piece: XiangqiPieceRaw): Set<string> {
    const attacks = new Set<string>()

    switch (piece.type) {
      case 'p': { // Солдат
        if (piece.color === 'b') {
          if (row < 9) attacks.add(getSquareNotation(row + 1, col))
          if (row >= 5) {
            if (col > 0) attacks.add(getSquareNotation(row, col - 1))
            if (col < 8) attacks.add(getSquareNotation(row, col + 1))
          }
        } else {
          if (row > 0) attacks.add(getSquareNotation(row - 1, col))
          if (row <= 4) {
            if (col > 0) attacks.add(getSquareNotation(row, col - 1))
            if (col < 8) attacks.add(getSquareNotation(row, col + 1))
          }
        }
        break
      }

      case 'c': { // Пушка — через экран
        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) {
          let r = row + dr, c = col + dc
          let foundScreen = false
          while (r >= 0 && r < 10 && c >= 0 && c < 9) {
            const sq = getSquareNotation(r, c)
            const p = game.value.get(sq)
            if (!foundScreen) {
              if (p) foundScreen = true
            } else {
              if (p) { attacks.add(sq); break }
            }
            r += dr; c += dc
          }
        }
        break
      }

      case 'n': { // Конь — с блокировкой
        const horseMoves = [
          { dr: -2, dc: -1, br: -1, bc: 0 }, { dr: -2, dc: 1, br: -1, bc: 0 },
          { dr: -1, dc: -2, br: 0, bc: -1 }, { dr: -1, dc: 2, br: 0, bc: 1 },
          { dr: 1, dc: -2, br: 0, bc: -1 },  { dr: 1, dc: 2, br: 0, bc: 1 },
          { dr: 2, dc: -1, br: 1, bc: 0 },   { dr: 2, dc: 1, br: 1, bc: 0 },
        ]
        for (const { dr, dc, br, bc } of horseMoves) {
          const nr = row + dr, nc = col + dc
          if (nr >= 0 && nr < 10 && nc >= 0 && nc < 9) {
            if (!game.value.get(getSquareNotation(row + br, col + bc))) {
              attacks.add(getSquareNotation(nr, nc))
            }
          }
        }
        break
      }

      case 'r': { // Колесница
        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) {
          let r = row + dr, c = col + dc
          while (r >= 0 && r < 10 && c >= 0 && c < 9) {
            const sq = getSquareNotation(r, c)
            attacks.add(sq)
            if (game.value.get(sq)) break
            r += dr; c += dc
          }
        }
        break
      }

      case 'a': { // Советник — только во дворце
        for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]] as const) {
          const nr = row + dr, nc = col + dc
          if (piece.color === 'b') {
            if (nr >= 0 && nr <= 2 && nc >= 3 && nc <= 5) attacks.add(getSquareNotation(nr, nc))
          } else {
            if (nr >= 7 && nr <= 9 && nc >= 3 && nc <= 5) attacks.add(getSquareNotation(nr, nc))
          }
        }
        break
      }

      case 'b': { // Слон — не пересекает реку, блокируется
        for (const [dr, dc] of [[-2, -2], [-2, 2], [2, -2], [2, 2]] as const) {
          const nr = row + dr, nc = col + dc
          const inRange = piece.color === 'b'
            ? nr >= 0 && nr <= 4
            : nr >= 5 && nr <= 9
          if (inRange && nc >= 0 && nc < 9) {
            if (!game.value.get(getSquareNotation(row + dr / 2, col + dc / 2))) {
              attacks.add(getSquareNotation(nr, nc))
            }
          }
        }
        break
      }

      case 'k': { // Генерал — только во дворце
        for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) {
          const nr = row + dr, nc = col + dc
          if (piece.color === 'b') {
            if (nr >= 0 && nr <= 2 && nc >= 3 && nc <= 5) attacks.add(getSquareNotation(nr, nc))
          } else {
            if (nr >= 7 && nr <= 9 && nc >= 3 && nc <= 5) attacks.add(getSquareNotation(nr, nc))
          }
        }
        break
      }
    }

    return attacks
  }

  /** Все клетки, атакуемые чёрными (для подсветки опасных ходов красных) */
  function getBlackAttackedSquares(): Set<string> {
    const attacked = new Set<string>()
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 9; col++) {
        const sq = getSquareNotation(row, col)
        const piece = game.value.get(sq)
        if (!piece || piece.color !== 'b') continue
        for (const s of getSquareAttacks(row, col, piece)) attacked.add(s)
      }
    }
    return attacked
  }

  /** Фигуры указанного цвета, атакующие конкретную клетку */
  function getAttackersOfSquare(targetSquare: string, attackerColor: 'r' | 'b'): Set<string> {
    const attackers = new Set<string>()
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 9; col++) {
        const sq = getSquareNotation(row, col)
        const piece = game.value.get(sq)
        if (!piece || piece.color !== attackerColor) continue
        if (getSquareAttacks(row, col, piece).has(targetSquare)) {
          attackers.add(sq)
        }
      }
    }
    return attackers
  }

  // ─── Подсветка ────────────────────────────────────────────────────────────

  function updateHighlightMap(square: string | null) {
    if (!square) {
      highlightMap.value = new Map()
      return
    }

    const map = new Map<string, XiangqiHighlightClass>()
    const blackAttacked = getBlackAttackedSquares()
    const attackers = blackAttacked.has(square)
      ? getAttackersOfSquare(square, 'b')
      : new Set<string>()

    map.set(square, blackAttacked.has(square) ? 'selected-under-attack' : 'selected')

    // Библиотека xiangqi.min.js возвращает строки вида "e9e8" даже при verbose: true,
    // поэтому парсим вручную: first 2 chars = from, last 2 chars = to
    const rawMoves = game.value.moves({ square }) as string[]
    const destinations = rawMoves.map(m => m.slice(-2))

    for (const target of destinations) {
      const targetPiece = game.value.get(target)
      const isAttack = !!targetPiece && targetPiece.color === 'b'
      const isHazardous = blackAttacked.has(target)

      if (isAttack && isHazardous)     map.set(target, 'attackable-hazardous')
      else if (isAttack)               map.set(target, 'attackable')
      else if (isHazardous)            map.set(target, 'hazardous')
      else                             map.set(target, 'highlight')
    }

    for (const attacker of attackers) {
      if (attacker !== square) map.set(attacker, 'attacker-of-selected')
    }

    highlightMap.value = map
  }

  // ─── AI (minimax) ─────────────────────────────────────────────────────────

  function evaluatePosition(): number {
    const values: Record<string, number> = {
      p: 1, c: 4.5, n: 4, r: 9, a: 2, b: 2, k: 0,
    }
    let score = 0
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 9; col++) {
        const piece = aiGame.get(getSquareNotation(row, col))
        if (piece) score += (piece.color === 'r' ? 1 : -1) * (values[piece.type] ?? 0)
      }
    }
    return score
  }

  function minimax(depth: number, alpha: number, beta: number, maximizing: boolean): number {
    if (depth === 0 || aiGame.game_over()) return evaluatePosition()

    const moves = aiGame.moves() as string[]
    if (maximizing) {
      let max = -Infinity
      for (const move of moves) {
        aiGame.move(move)
        max = Math.max(max, minimax(depth - 1, alpha, beta, false))
        aiGame.undo()
        alpha = Math.max(alpha, max)
        if (beta <= alpha) break
      }
      return max
    } else {
      let min = Infinity
      for (const move of moves) {
        aiGame.move(move)
        min = Math.min(min, minimax(depth - 1, alpha, beta, true))
        aiGame.undo()
        beta = Math.min(beta, min)
        if (beta <= alpha) break
      }
      return min
    }
  }

  function getBestMove(): string | null {
    aiGame = createXiangqiFromFen(game.value.fen())
    const moves = aiGame.moves() as string[]
    if (!moves.length) return null

    const isRed = aiGame.turn() === 'r'
    let bestMove: string | null = null
    let bestValue = isRed ? -Infinity : Infinity

    const shuffled = [...moves].sort(() => Math.random() - 0.5)

    for (const move of shuffled) {
      aiGame.move(move)
      const value = minimax(config.aiDepth - 1, -Infinity, Infinity, aiGame.turn() === 'r')
      aiGame.undo()
      if (isRed ? value > bestValue : value < bestValue) {
        bestValue = value
        bestMove = move
      }
    }

    return bestMove
  }

  // ─── Управление игрой ─────────────────────────────────────────────────────

  function scheduleNextMove(delay: number) {
    if (moveTimeout) clearTimeout(moveTimeout)
    if (!isPaused.value) moveTimeout = setTimeout(makeAiMove, delay)
  }

  function makeAiMove() {
    if (gameOver.value || isPaused.value) return
    // В режиме игрока бот ходит только за чёрных
    if (!aiEnabled.value && game.value.turn() === 'r') return
    if (game.value.game_over()) { handleGameOver(); return }

    const best = getBestMove()
    if (!best) return

    const moveObj = game.value.move(best)
    if (moveObj) {
      lastMove.value = { from: moveObj.from, to: moveObj.to }
      const piece = game.value.get(moveObj.to) ?? { type: moveObj.piece, color: moveObj.color }
      const queued = queueMoveAnimation(moveObj.from, moveObj.to, piece)
      if (!queued) commitGameState()

      if (game.value.game_over()) {
        handleGameOver()
      } else if (aiEnabled.value) {
        scheduleNextMove(config.moveDelay)
      }
    }
  }

  function handleCellClick(row: number, col: number) {
    if (isAnimating.value || aiEnabled.value || gameOver.value || game.value.turn() !== 'r') return

    const square = getSquareNotation(row, col)
    const piece = game.value.get(square)

    if (!selectedSquare.value) {
      if (piece && piece.color === 'r') {
        selectedSquare.value = square
        updateHighlightMap(square)
      }
      return
    }

    const from = selectedSquare.value

    // Переключение на другую красную фигуру
    if (piece && piece.color === 'r' && square !== from) {
      selectedSquare.value = square
      updateHighlightMap(square)
      return
    }

    const possibleMoves = game.value.moves({ square: from, verbose: true }) as XiangqiMoveVerbose[]
    const destinations = new Set(possibleMoves.map(m => m.to))

    if (!destinations.has(square)) {
      selectedSquare.value = null
      updateHighlightMap(null)
      return
    }

    const movingPiece = game.value.get(from)
    const moveResult = game.value.move({ from, to: square })

    if (moveResult && movingPiece) {
      lastMove.value = { from: moveResult.from, to: moveResult.to }
      selectedSquare.value = null
      updateHighlightMap(null)

      const queued = queueMoveAnimation(moveResult.from, moveResult.to, movingPiece)
      if (!queued) commitGameState()

      if (game.value.game_over()) {
        handleGameOver()
      } else if (!isPaused.value) {
        scheduleNextMove(config.moveDelay)
      }
    }
  }

  function handleGameOver() {
    gameOver.value = true
    gameOverStatus.value = gameState.value.status
    gameWinner.value = gameState.value.winner

    startRestartTimer()

    setTimeout(() => {
      game.value = new Xiangqi()
      updateBoard()
      gameOver.value = false
      gameOverStatus.value = null
      gameWinner.value = null
      selectedSquare.value = null
      lastMove.value = null
      updateHighlightMap(null)

      if (aiEnabled.value && !isPaused.value) scheduleNextMove(1000)
    }, 10000)
  }

  function startRestartTimer() {
    if (restartInterval) return
    restartTimeLeft.value = 10
    showRestartTimer.value = true

    restartInterval = setInterval(() => {
      restartTimeLeft.value--
      if (restartTimeLeft.value <= 0) {
        clearInterval(restartInterval!)
        restartInterval = null
        showRestartTimer.value = false
      }
    }, 1000)
  }

  function resetRestartTimer() {
    if (restartInterval) {
      clearInterval(restartInterval)
      restartInterval = null
    }
    restartTimeLeft.value = 10
    showRestartTimer.value = false
  }

  function togglePause() {
    if (isPaused.value) {
      isPaused.value = false
      if (!gameOver.value) scheduleNextMove(100)
    } else {
      isPaused.value = true
      if (moveTimeout) { clearTimeout(moveTimeout); moveTimeout = null }
    }
  }

  function toggleAI() {
    aiEnabled.value = !aiEnabled.value
    selectedSquare.value = null
    updateHighlightMap(null)

    // В режиме "бот vs бот", если сейчас ход красных — запускаем
    if (aiEnabled.value && !isPaused.value && game.value.turn() === 'r') {
      scheduleNextMove(100)
    }
  }

  function reset() {
    if (moveTimeout) { clearTimeout(moveTimeout); moveTimeout = null }
    game.value = new Xiangqi()
    updateBoard()
    gameOver.value = false
    selectedSquare.value = null
    lastMove.value = null
    gameOverStatus.value = null
    gameWinner.value = null
    updateHighlightMap(null)
    resetRestartTimer()

    if (!isPaused.value && aiEnabled.value) scheduleNextMove(1000)
  }

  onUnmounted(() => {
    if (moveTimeout) clearTimeout(moveTimeout)
    if (restartInterval) clearInterval(restartInterval)
  })

  return {
    board,
    gameState,
    highlightMap,
    isPaused,
    aiEnabled,
    selectedSquare,
    lastMove,
    animatedMove,
    isAnimating,
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
    scale: config.scale,
  }
}
