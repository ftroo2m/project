<script setup lang="ts">
import type { Room } from '../types/room';
import { getRoomIcon, getRoomDescription } from '../utils/roomUtils';
import { THEME_COLORS } from '../constants/colors';
import { useRouter } from 'vue-router'
import { gameSocket } from '../services/gameSocket'

defineProps<{
  room: Room;
  isCurrent: boolean;
  isLocked: boolean;
}>();

const getRoomColor = (type: Room['type']) => THEME_COLORS.rooms[type];

const router = useRouter()

const handleNodeClick = () => {
  // 建立 WebSocket 连接
  gameSocket.connect()
  
  // 导航到战斗页面
  router.push({
    path: '/battle',
    query: {
      roomType: 'monster',
      monsterId: '123'
    }
  })
}
</script>

<template>
  <div 
    class="room-node"
    :class="{
      'current': isCurrent,
      'completed': room.completed,
      'locked': isLocked
    }"
    :style="{
      '--room-color': getRoomColor(room.type)
    }"
    @click="handleNodeClick"
  >
    <div class="room-content">
      <span class="room-icon">{{ getRoomIcon(room.type) }}</span>
    </div>
    <div class="room-tooltip">
      <div class="room-type">{{ room.type }}</div>
      <div class="room-description">{{ getRoomDescription(room.type) }}</div>
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
  background-color: rgb(17, 24, 39);
  border: 2px solid var(--room-color);
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
  background-color: rgb(17, 24, 39);
  padding: 0.8rem;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  width: 150px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--room-color);
}

.room-node:hover .room-tooltip {
  opacity: 1;
}

.room-type {
  text-transform: capitalize;
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: var(--room-color);
}

.room-description {
  font-size: 0.8rem;
  color: rgb(255, 255, 255);
}

.current .room-content {
  box-shadow: 0 0 15px var(--room-color);
  transform: scale(1.1);
}

.completed .room-content {
  background-color: rgb(17, 24, 39);
  border-color: v-bind('THEME_COLORS.completed');
}

.locked .room-content {
  background-color: rgb(17, 24, 39);
  filter: grayscale(1);
}
</style>