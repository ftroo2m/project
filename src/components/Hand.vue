<script setup lang="ts">
import { ref } from 'vue'
import type { Card } from '../types/game'
import DraggableCard from './DraggableCard.vue'

const props = defineProps<{
  cards: Card[]
}>()

const draggingCard = ref<Card | null>(null)
const dragPosition = ref({ x: 0, y: 0 })
const playAreaActive = ref(false)

const onDragStart = (event: MouseEvent, card: Card) => {
  draggingCard.value = card
  playAreaActive.value = true
  dragPosition.value = { x: event.clientX, y: event.clientY }

  const onMouseMove = (e: MouseEvent) => {
    dragPosition.value = { x: e.clientX, y: e.clientY }
  }

  const onMouseUp = () => {
    draggingCard.value = null
    playAreaActive.value = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
}

defineExpose({
  playAreaActive
})
</script>

<template>
  <div class="hand">
    <DraggableCard
      v-for="card in cards"
      :key="card.Name"
      :card="card"
      :is-dragging="draggingCard === card"
      :drag-position="dragPosition"
      @dragStart="onDragStart($event, card)"
    />
  </div>
</template>

<style scoped>
.hand {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
}
</style>