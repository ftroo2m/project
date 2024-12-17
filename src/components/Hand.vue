<script setup lang="ts">
import { ref } from 'vue'
import type { Card } from '../types/game'
import DraggableCard from './DraggableCard.vue'

const props = defineProps<{
  cards: Card[]
}>()

const emit = defineEmits(['dragStart', 'dragEnd'])

const draggingCard = ref<Card | null>(null)
const dragPosition = ref({ x: 0, y: 0 })
const playAreaActive = ref(false)

const handleCardDragStart = (event: MouseEvent, card: Card) => {
  draggingCard.value = card
  playAreaActive.value = true
  dragPosition.value = {
    x: event.clientX,
    y: event.clientY
  }
  emit('dragStart', card.Name)

  // 添加鼠标移动事件监听
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (event: MouseEvent) => {
  if (draggingCard.value) {
    dragPosition.value = {
      x: event.clientX,
      y: event.clientY
    }
  }
}

const handleMouseUp = () => {
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('mouseup', handleMouseUp)
  handleCardDragEnd()
}

const handleCardDragEnd = () => {
  draggingCard.value = null
  playAreaActive.value = false
  emit('dragEnd')
}

defineExpose({
  playAreaActive
})
</script>

<template>
  <div class="hand">
    <DraggableCard
      v-for="card in cards"
      :key="card.ID"
      :card="card"
      :is-dragging="draggingCard === card"
      :drag-position="dragPosition"
      @drag-start="($event) => handleCardDragStart($event, card)"
      @drag-end="handleCardDragEnd"
    />
  </div>
</template>

<style scoped>
.hand {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 2rem;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>