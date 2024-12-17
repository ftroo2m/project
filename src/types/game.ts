// src/types/game.ts
export interface CardResponse {
  code: number
  data: {
    card: Card
  }
  message: string
}

export interface Card {
  Name: string
  Type: string
  Energy: number
  Target: string
  Description: string
  Damage?: number
  Block?: number
  Power?: {
    vulnerable?: number
    [key: string]: number | undefined
  }
  [key: string]: any
}

export interface GameState {
  type: string
  player: {
    newCard: CardResponse[] | any[]
    hp: number
    maxHp: number
    energy: number
    block: number
    power: {
      [key: string]: number | undefined
    }
    image: string
  }
  monster: {
    hp: number
    maxHp: number
    actionName: string
    actionValue: number
    block: number
    power: {
      [key: string]: number | undefined
    }
    image: string
  }
}

export interface CardDragOptions {
  onDragStart?: (card: Card) => void
  onDragEnd?: () => void
  onDragMove?: (x: number, y: number) => void
}