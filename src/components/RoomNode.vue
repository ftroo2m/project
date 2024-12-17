<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { gameSocket } from '../services/gameSocket'
import { getRoomIcon } from '../utils/roomUtils'
import type { Room } from '../types/room'

const props = defineProps<{
  id: number
  room?: Room
  isCurrent?: boolean
  isLocked?: boolean
  class?: string | Record<string, boolean>
}>()

const router = useRouter()

const handleNodeClick = () => {
  if (props.isLocked) return
  
  gameSocket.connect(`room${props.id}`, (state) => {
    console.log('Connected to room:', props.id)
    router.push(`/battle/${props.id}`)
  })
}
</script>

<template>
  <div 
    class="room-node"
    :class="[
      {
        'current': isCurrent,
        'completed': room?.completed,
        'locked': isLocked,
        'active': isCurrent && !isLocked
      },
      props.class
    ]"
  >
    <div class="room-content">
      <span class="room-icon">{{ room?.type ? getRoomIcon(room.type) : `Room ${id}` }}</span>
    </div>
    <div class="room-tooltip">
      <div class="room-type">
        {{ room?.type === 'monster' ? '普通怪物' :
           room?.type === 'elite' ? '精英怪物' :
           room?.type === 'boss' ? 'Boss' :
           room?.type === 'bonfire' ? '休息处' : ''
        }}
      </div>
      <div class="room-description">
        {{ room?.type === 'monster' ? '与普通怪物战斗' :
           room?.type === 'elite' ? '与精英怪物战斗' :
           room?.type === 'boss' ? '与Boss战斗' :
           room?.type === 'bonfire' ? '恢复20点生命值' : ''
        }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.room-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.room-content {
  background-color: #2a2a2a;
  border: 2px solid #666;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.room-icon {
  font-size: 1.5rem;
}

.room-tooltip {
  position: absolute;
  left: 70px;
  background-color: #333;
  padding: 0.8rem;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  width: 150px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #666;
}

.room-node:hover .room-tooltip {
  opacity: 1;
}

.room-type {
  text-transform: capitalize;
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: #4a9eff;
}

.room-description {
  font-size: 0.8rem;
  color: #ccc;
}

.current .room-content {
  box-shadow: 0 0 15px #4a9eff;
  transform: scale(1.1);
  border-color: #4a9eff;
}

.completed .room-content {
  opacity: 0.7;
  border-color: #4caf50;
}

.locked .room-content {
  opacity: 0.5;
  filter: grayscale(1);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 15px #4a9eff,
                0 0 15px #ffd700;
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 25px #4a9eff,
                0 0 25px #ffd700;
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 15px #4a9eff,
                0 0 15px #ffd700;
  }
}

.active .room-content {
  animation: pulse 1.5s infinite ease-in-out;
  border-color: #4a9eff;
}

.active .room-content:hover {
  animation-play-state: paused;
}
</style>