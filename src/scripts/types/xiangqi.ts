export interface XiangqiOptions {
  moveDelay?: number
  aiDepth?: number
  scale?: number
}

export interface XiangqiBoardCell {
  row: number
  col: number
  square: string
  piece: XiangqiPiece | null
}

export interface XiangqiPiece {
  type: string
  color: 'r' | 'b'
}

export type XiangqiHighlightClass =
  | 'selected'
  | 'selected-under-attack'
  | 'attacker-of-selected'
  | 'attackable'
  | 'attackable-hazardous'
  | 'hazardous'
  | 'highlight'
  | 'unreachable'
  | null

export type XiangqiGameStatus = 'playing' | 'checkmate' | 'stalemate' | 'draw'

export interface XiangqiGameState {
  status: XiangqiGameStatus
  /** Победитель: 'r' — красные, 'b' — чёрные */
  winner: 'r' | 'b' | null
  currentTurn: 'r' | 'b'
}
