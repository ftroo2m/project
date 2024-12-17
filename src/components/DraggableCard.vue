<script setup lang="ts">
import type { Card } from '../types/game'

const props = defineProps<{
  card: Card
  isDragging: boolean
  dragPosition: { x: number; y: number }
}>()

const emit = defineEmits(['dragStart', 'dragEnd'])

const handleMouseDown = (event: MouseEvent) => {
  if (event.button !== 0) return
  emit('dragStart', event)
}

const handleMouseUp = (event: MouseEvent) => {
  emit('dragEnd', event)
}

const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault()
}
</script>

<template>
  <div
    class="card"
    :class="{ dragging: isDragging }"
    :style="isDragging ? {
      position: 'fixed',
      left: `${dragPosition.x}px`,
      top: `${dragPosition.y}px`,
      transform: 'translate(-50%, -50%)',
      zIndex: 1000
    } : {}"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
    @contextmenu="handleContextMenu"
    @selectstart.prevent
    @copy.prevent
    @dragstart.prevent
  >
    <div class="card-cost">{{ card.Energy }}</div>
    <div class="card-image" v-if="card.Image">
      <img :src="`data:image/jpeg;base64,${card.Image}`" alt="card image" />
    </div>
    <div class="card-content">
      <h3 class="card-name">{{ card.Name }}</h3>
      <p class="card-description">{{ card.Description }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 150px;
  height: 200px;
  background: #2a2a2a;
  border: 2px solid #4a4a4a;
  border-radius: 10px;
  position: relative;
  transition: transform 0.2s;
  cursor: grab;
  touch-action: none;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.card-image {
  width: 100%;
  height: 100px;  /* 固定图片高度 */
  overflow: hidden;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 0.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.8);
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
  z-index: 2;
}

.card-name {
  margin: 0.3rem 0;
  text-align: center;
  color: #fff;
  font-size: 0.9rem;
}

.card-description {
  font-size: 0.7rem;
  color: #ccc;
  text-align: center;
  margin: 0;
}

.card:hover:not(.dragging) {
  transform: translateY(-20px);
}

.card.dragging {
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
}
</style>