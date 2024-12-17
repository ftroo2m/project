<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { gameSocket } from '../services/gameSocket'

const props = defineProps<{
  isActive: boolean
  currentCard?: string | null
  playerEnergy: number
  cards: any[]
}>()

const emit = defineEmits(['cardPlayed'])

const handleMouseUp = (event: MouseEvent) => {
  const playAreaElement = document.querySelector('.play-area')
  if (!playAreaElement || !props.isActive || !props.currentCard) return
  
  const rect = playAreaElement.getBoundingClientRect()
  
  if (event.clientX >= rect.left && 
      event.clientX <= rect.right && 
      event.clientY >= rect.top && 
      event.clientY <= rect.bottom) {
    
    const card = props.cards.find(c => c.Name === props.currentCard)
    if (!card || card.Energy > props.playerEnergy) return
    
    gameSocket.send({
      type: "card",
      name: props.currentCard
    })
    
    emit('cardPlayed')
  }
}

onMounted(() => {
  window.addEventListener('mouseup', handleMouseUp)
})

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', handleMouseUp)
})
</script>

<template>
  <div 
    class="play-area" 
    :class="{ active: isActive }"
  >
    <div class="play-text">
      Play Card
    </div>
  </div>
</template>

<style scoped>
.play-area {
  width: 200px;
  height: 250px;
  border: 2px dashed #666;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: all 0.3s;
  position: relative;
  z-index: 1000;
}

.active {
  border-color: #4a9eff;
  background: rgba(74, 158, 255, 0.1);
}
</style>