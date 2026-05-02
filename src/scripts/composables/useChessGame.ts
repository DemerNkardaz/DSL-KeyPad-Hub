import { ref, computed, onUnmounted } from 'vue'
import { Chess, type Square, type Move } from 'chess.js'
import type { ChessOptions, BoardCell, GameState, HighlightClass } from '../types/chess'

export function useChessGame(options: ChessOptions = {}) {
  const config = {
    moveDelay: options.moveDelay ?? 800,
    aiDepth: options.aiDepth ?? 3,
    scale: options.scale ?? 1,
  }

  // Реактивный инстанс — только для чтения в темплейте
  const game = ref(new Chess())
  // Нереактивный инстанс — только для AI-расчётов
  let aiGame = new Chess()

  const gameOver = ref(false)
  const isPaused = ref(true)
  const aiEnabled = ref(true)
  const selectedSquare = ref<Square | null>(null)
  const lastMove = ref<{ from: string; to: string } | null>(null)
  const animatedMove = ref<{ from: string; to: string; piece: { type: string; color: 'w' | 'b' } } | null>(null)
  const isAnimating = ref(false)
  const restartTimeLeft = ref(10)
  const showRestartTimer = ref(false)
  const gameOverStatus = ref<GameState['status'] | null>(null)
  const gameWinner = ref<'w' | 'b' | null>(null)

  // highlightMap — явный ref, обновляется только при выборе/сбросе фигуры
  const highlightMap = ref<Map<string, HighlightClass>>(new Map())

  let moveTimeout: ReturnType<typeof setTimeout> | null = null
  let restartInterval: ReturnType<typeof setInterval> | null = null

  // ─── Unicode фигуры ───────────────────────────────────────────────

  const unicodePieces: Record<string, string> = {
    wK: '♚', wQ: '♛', wR: '♜', wB: '♝', wN: '♞', wP: '♟',
    bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟',
  }

  function pieceToUnicode(color: 'w' | 'b', type: string): string {
    return unicodePieces[color + type.toUpperCase()] ?? ''
  }

  // ─── Нотация ─────────────────────────────────────────────────────

  function getSquareNotation(row: number, col: number): Square {
    return (String.fromCharCode(97 + col) + (8 - row)) as Square
  }

  // ─── Триггер реактивности ─────────────────────────────────────────
  // Вызывается ТОЛЬКО после завершения всех расчётов — один раз на ход.

  const animationDuration = 300

  function commitGameState() {
    game.value = new Chess(game.value.fen())
    updateBoard()
  }

  function queueMoveAnimation(from: string, to: string, piece: { type: string; color: 'w' | 'b' }) {
    if (isAnimating.value) return false
    isAnimating.value = true
    animatedMove.value = { from, to, piece }
    updateHighlightMap(null)

    setTimeout(() => {
      game.value = new Chess(game.value.fen())
      updateBoard()
      isAnimating.value = false
      animatedMove.value = null
    }, animationDuration)

    return true
  }

  // ─── Состояние игры ───────────────────────────────────────────────

  const gameState = computed<GameState>(() => {
    const g = game.value
    let status: GameState['status'] = 'playing'
    let winner: 'w' | 'b' | null = null

    if (g.isCheckmate()) {
      status = 'checkmate'
      winner = g.turn() === 'w' ? 'b' : 'w'
    } else if (g.isStalemate()) {
      status = 'stalemate'
    } else if (g.isDraw()) {
      status = 'draw'
    }

    return {
      status,
      winner,
      currentTurn: g.turn() as 'w' | 'b',
      isCheck: g.isCheck(),
    }
  })

  // ─── Доска ────────────────────────────────────────────────────────

  const board = ref<BoardCell[]>([])

  function buildBoard(): BoardCell[] {
    const raw = game.value.board()
    const cells: BoardCell[] = []

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = raw[row][col]
        cells.push({
          row,
          col,
          square: getSquareNotation(row, col),
          isLight: (row + col) % 2 === 0,
          piece: piece ? { type: piece.type, color: piece.color } : null,
        })
      }
    }

    return cells
  }

  function updateBoard() {
    board.value = buildBoard()
  }

  updateBoard()

  // ─── Атаки (принимают rawBoard явно) ─────────────────────────────

  type RawBoard = ReturnType<Chess['board']>

  function addDiagonalAttacks(row: number, col: number, set: Set<string>, rawBoard: RawBoard) {
    for (const [dr, dc] of [[-1, -1], [-1, 1], [1, -1], [1, 1]] as const) {
      let r = row + dr, c = col + dc
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        set.add(getSquareNotation(r, c))
        if (rawBoard[r][c]) break
        r += dr; c += dc
      }
    }
  }

  function addStraightAttacks(row: number, col: number, set: Set<string>, rawBoard: RawBoard) {
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]] as const) {
      let r = row + dr, c = col + dc
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        set.add(getSquareNotation(r, c))
        if (rawBoard[r][c]) break
        r += dr; c += dc
      }
    }
  }

  function getBlackAttackedSquares(rawBoard: RawBoard): Set<string> {
    const attacked = new Set<string>()

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = rawBoard[row][col]
        if (!piece || piece.color !== 'b') continue

        switch (piece.type) {
          case 'p':
            if (row < 7) {
              if (col > 0) attacked.add(getSquareNotation(row + 1, col - 1))
              if (col < 7) attacked.add(getSquareNotation(row + 1, col + 1))
            }
            break
          case 'n':
            for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]] as const) {
              const nr = row + dr, nc = col + dc
              if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) attacked.add(getSquareNotation(nr, nc))
            }
            break
          case 'b': addDiagonalAttacks(row, col, attacked, rawBoard); break
          case 'r': addStraightAttacks(row, col, attacked, rawBoard); break
          case 'q':
            addDiagonalAttacks(row, col, attacked, rawBoard)
            addStraightAttacks(row, col, attacked, rawBoard)
            break
          case 'k':
            for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]] as const) {
              const nr = row + dr, nc = col + dc
              if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) attacked.add(getSquareNotation(nr, nc))
            }
            break
        }
      }
    }

    return attacked
  }

  function getAttackersOfSquare(targetSquare: string, attackerColor: 'w' | 'b', rawBoard: RawBoard): Set<string> {
    const attackers = new Set<string>()

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = rawBoard[row][col]
        if (!piece || piece.color !== attackerColor) continue

        const attacks = new Set<string>()
        switch (piece.type) {
          case 'p':
            if (piece.color === 'b' && row < 7) {
              if (col > 0) attacks.add(getSquareNotation(row + 1, col - 1))
              if (col < 7) attacks.add(getSquareNotation(row + 1, col + 1))
            } else if (piece.color === 'w' && row > 0) {
              if (col > 0) attacks.add(getSquareNotation(row - 1, col - 1))
              if (col < 7) attacks.add(getSquareNotation(row - 1, col + 1))
            }
            break
          case 'n':
            for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]] as const) {
              const nr = row + dr, nc = col + dc
              if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) attacks.add(getSquareNotation(nr, nc))
            }
            break
          case 'b': addDiagonalAttacks(row, col, attacks, rawBoard); break
          case 'r': addStraightAttacks(row, col, attacks, rawBoard); break
          case 'q':
            addDiagonalAttacks(row, col, attacks, rawBoard)
            addStraightAttacks(row, col, attacks, rawBoard)
            break
          case 'k':
            for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]] as const) {
              const nr = row + dr, nc = col + dc
              if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) attacks.add(getSquareNotation(nr, nc))
            }
            break
        }

        if (attacks.has(targetSquare)) attackers.add(getSquareNotation(row, col))
      }
    }

    return attackers
  }

  // ─── Явный пересчёт подсветки ─────────────────────────────────────
  // Вызывается только при выборе фигуры или сбросе выделения.
  // Не является computed — не реагирует на изменения game.value автоматически.

  function updateHighlightMap(square: Square | null) {
    if (!square) {
      highlightMap.value = new Map()
      return
    }

    const map = new Map<string, HighlightClass>()
    const rawBoard = game.value.board()
    const blackAttacked = getBlackAttackedSquares(rawBoard)
    const attackers = blackAttacked.has(square)
      ? getAttackersOfSquare(square, 'b', rawBoard)
      : new Set<string>()

    map.set(square, blackAttacked.has(square) ? 'selected-under-attack' : 'selected')

    const possibleMoves = game.value.moves({ square, verbose: true }) as Move[]
    for (const move of possibleMoves) {
      const targetSquare = move.to
      const targetPiece = game.value.get(targetSquare)
      const isAttack = !!targetPiece && targetPiece.color === 'b'
      const isHazardous = blackAttacked.has(targetSquare)

      if (isAttack && isHazardous) map.set(targetSquare, 'attackable-hazardous')
      else if (isAttack) map.set(targetSquare, 'attackable')
      else if (isHazardous) map.set(targetSquare, 'hazardous')
      else map.set(targetSquare, 'highlight')
    }

    for (const attacker of attackers) {
      if (attacker !== square) map.set(attacker, 'attacker-of-selected')
    }

    highlightMap.value = map
  }

  // ─── AI ──────────────────────────────────────────────────────────

  function evaluatePosition(): number {
    const values: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }
    let score = 0
    for (const row of aiGame.board()) {
      for (const piece of row) {
        if (piece) score += (piece.color === 'w' ? 1 : -1) * (values[piece.type] ?? 0)
      }
    }
    return score
  }

  function minimax(depth: number, alpha: number, beta: number, maximizing: boolean): number {
    if (depth === 0 || aiGame.isGameOver()) return evaluatePosition()

    const moves = aiGame.moves()

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
    aiGame = new Chess(game.value.fen())

    const moves = aiGame.moves()
    if (!moves.length) return null

    const isWhite = aiGame.turn() === 'w'
    let bestMove: string | null = null
    let bestValue = isWhite ? -Infinity : Infinity

    const shuffled = [...moves].sort(() => Math.random() - 0.5)

    for (const move of shuffled) {
      aiGame.move(move)
      const value = minimax(config.aiDepth - 1, -Infinity, Infinity, aiGame.turn() === 'w')
      aiGame.undo()

      if (isWhite ? value > bestValue : value < bestValue) {
        bestValue = value
        bestMove = move
      }
    }

    return bestMove
  }

  // ─── Управление игрой ────────────────────────────────────────────

  function scheduleNextMove(delay: number) {
    if (moveTimeout) clearTimeout(moveTimeout)
    if (!isPaused.value) moveTimeout = setTimeout(makeAiMove, delay)
  }

  function makeAiMove() {
    if (gameOver.value || isPaused.value) return
    if (!aiEnabled.value && game.value.turn() === 'w') return
    if (game.value.isGameOver()) { handleGameOver(); return }

    const best = getBestMove()
    if (!best) return

    const moveObj = game.value.move(best)
    if (moveObj) {
      lastMove.value = { from: moveObj.from, to: moveObj.to }
      const queued = queueMoveAnimation(moveObj.from, moveObj.to, {
        type: moveObj.piece,
        color: moveObj.color,
      })
      if (!queued) {
        commitGameState()
      }

      if (game.value.isGameOver()) {
        handleGameOver()
      } else if (aiEnabled.value) {
        scheduleNextMove(config.moveDelay)
      }
    }
  }

  function handleCellClick(row: number, col: number) {
    if (isAnimating.value || aiEnabled.value || gameOver.value || game.value.turn() !== 'w') return

    const square = getSquareNotation(row, col)
    const piece = game.value.get(square)

    if (!selectedSquare.value) {
      if (piece && piece.color === 'w') {
        selectedSquare.value = square
        updateHighlightMap(square)
      }
      return
    }

    const from = selectedSquare.value
    const movingPiece = game.value.get(from)
    const possibleMoves = game.value.moves({ square: from, verbose: true }) as Move[]
    const possibleDestinations = new Set(possibleMoves.map(m => m.to))

    if (piece && piece.color === 'w' && square !== from) {
      selectedSquare.value = square
      updateHighlightMap(square)
      return
    }

    if (!possibleDestinations.has(square)) {
      selectedSquare.value = null
      updateHighlightMap(null)
      return
    }

    const moveResult = game.value.move({
      from,
      to: square,
      promotion: 'q',
    })

    if (moveResult && movingPiece) {
      lastMove.value = { from: moveResult.from, to: moveResult.to }
      selectedSquare.value = null
      updateHighlightMap(null)
      const queued = queueMoveAnimation(moveResult.from, moveResult.to, {
        type: movingPiece.type,
        color: movingPiece.color,
      })
      if (!queued) {
        commitGameState()
      }

      if (game.value.isGameOver()) {
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
      game.value = new Chess()
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

    if (aiEnabled.value && !isPaused.value && game.value.turn() === 'w') {
      scheduleNextMove(100)
    }
  }

  function reset() {
    if (moveTimeout) { clearTimeout(moveTimeout); moveTimeout = null }
    game.value = new Chess()
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
    handleCellClick,
    togglePause,
    toggleAI,
    reset,
    scale: config.scale,
  }
}
