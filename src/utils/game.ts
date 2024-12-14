export interface Card {
  id: number
  name: string
  cost: number
  description: string
}

export interface GameState {
  energy: number
  selectedCard: Card | null
  isCardBeingPlayed: boolean
}