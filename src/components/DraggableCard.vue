<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '../types/game'

const props = defineProps<{
  card: Card
  isDragging: boolean
  dragPosition: { x: number; y: number }
}>()

const emit = defineEmits<{
  (e: 'dragStart', event: MouseEvent): void
  (e: 'dragEnd', event: MouseEvent): void
}>()

const cardStyle = computed(() => {
  if (!props.isDragging) return {}
  return {
    position: 'fixed',
    left: `${props.dragPosition.x - 75}px`,
    top: `${props.dragPosition.y - 100}px`,
    transform: 'rotate(5deg)',
    pointerEvents: 'none',
    zIndex: 1000,
    cursor: 'grabbing'
  }
})

const handleMouseDown = (event: MouseEvent) => {
  if (event.button !== 0) return // Only handle left mouse button
  emit('dragStart', event)
}
</script>

<template>
  <div
    class="card"
    :class="{ dragging: isDragging }"
    :style="cardStyle"
    @mousedown="handleMouseDown"
    @mouseup="$emit('dragEnd', $event)"
  >
    <div class="card-cost">{{ card.Energy }}</div>
    <h3 class="card-name">{{ card.Name }}</h3>
    <p class="card-description">{{ card.Description }}</p>
  </div>
</template>

<style scoped>
.card {
  width: 150px;
  height: 200px;
  background: #2a2a2a;
  border: 2px solid #4a4a4a;
  border-radius: 10px;
  padding: 1rem;
  position: relative;
  transition: transform 0.2s;
  cursor: grab;
  touch-action: none;
}

.card:hover:not(.dragging) {
  transform: translateY(-20px);
}

.card.dragging {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
}

.card-cost {
  position: absolute;
  top: 5px;
  left: 5px;
  background: #4a9eff;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.card-name {
  margin-top: 1.5rem;
  text-align: center;
  color: #fff;
}

.card-description {
  font-size: 0.8rem;
  color: #ccc;
  text-align: center;
  margin-top: 1rem;
}
</style>