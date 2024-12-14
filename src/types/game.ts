// src/types/game.ts
export interface GameState {
    player: {
      newCard: string[]
      hp: number
      energy: number
    }
    monster: {
      hp: number
      actionName: string
      actionValue: number
    }

  }

export interface Card {
  Name: string
  Energy: number
  Description: string
  // ... 其他属性
}