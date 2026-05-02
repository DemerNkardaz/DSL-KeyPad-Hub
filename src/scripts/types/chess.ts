export interface ChessOptions {
  moveDelay?: number
  aiDepth?: number
  scale?: number
}

export interface BoardCell {
  row: number
  col: number
  square: string
  isLight: boolean
  piece: ChessPiece | null
}

export interface ChessPiece {
  type: string
  color: 'w' | 'b'
}

export type HighlightClass =
  | 'selected'
  | 'selected-under-attack'
  | 'attacker-of-selected'
  | 'attackable'
  | 'attackable-hazardous'
  | 'hazardous'
  | 'highlight'
  | 'unreachable'
  | null

export interface CellHighlight {
  square: string
  cls: HighlightClass
}

export type GameStatus = 'playing' | 'checkmate' | 'stalemate' | 'draw'

export interface GameState {
  status: GameStatus
  winner: 'w' | 'b' | null
  currentTurn: 'w' | 'b'
  isCheck: boolean
}
