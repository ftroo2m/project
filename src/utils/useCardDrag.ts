import { ref } from 'vue'
import type { Card } from '../types/game'

export function useCardDrag() {
  const isDragging = ref(false)
  const draggedCard = ref<Card | null>(null)
  const dragPosition = ref({ x: 0, y: 0 })
  const playAreaActive = ref(false)
  const initialMousePosition = ref({ x: 0, y: 0 })

  const startDrag = (card: Card, event: MouseEvent) => {
    event.preventDefault()
    isDragging.value = true
    draggedCard.value = card
    initialMousePosition.value = {
      x: event.clientX,
      y: event.clientY
    }
    updateDragPosition(event)
  }

  const updateDragPosition = (event: MouseEvent) => {
    event.preventDefault()
    if (!isDragging.value) return

    dragPosition.value = {
      x: event.clientX,
      y: event.clientY
    }
    
    // Check if card is in play area (middle of screen)
    const screenHeight = window.innerHeight
    playAreaActive.value = event.clientY < screenHeight * 0.6
  }

  const endDrag = (event?: MouseEvent) => {
    event?.preventDefault()
    const wasInPlayArea = playAreaActive.value
    isDragging.value = false
    draggedCard.value = null
    playAreaActive.value = false
    return wasInPlayArea
  }

  return {
    isDragging,
    draggedCard,
    dragPosition,
    playAreaActive,
    startDrag,
    updateDragPosition,
    endDrag
  }
}