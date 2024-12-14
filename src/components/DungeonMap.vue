<script setup lang="ts">
import { ref } from 'vue';
import type { Room } from '../types/room';
import RoomNode from './RoomNode.vue';
import PathConnection from './PathConnection.vue';
import { THEME_COLORS } from '../constants/colors';
import { useRouter } from 'vue-router'

const rooms = ref<Room[]>([
  { id: 1, type: 'monster', completed: false },
  { id: 2, type: 'monster', completed: false },
  { id: 3, type: 'monster', completed: false },
  { id: 4, type: 'bonfire', completed: false },
  { id: 5, type: 'elite', completed: false },
  { id: 6, type: 'elite', completed: false },
  { id: 7, type: 'bonfire', completed: false },
  { id: 8, type: 'boss', completed: false },
]);

const currentRoom = ref(-1);

const router = useRouter()

const handleRoomClick = (index: number) => {
  if ((currentRoom.value === -1 && index === 0) || index === currentRoom.value + 1) {
    if (currentRoom.value >= 0) {
      rooms.value[currentRoom.value].completed = true;
    }
    currentRoom.value = index;
  }
};

const handleNodeClick = () => {
  router.push('/battle')
}
</script>

<template>
  <div class="dungeon-page">
    <div class="dungeon-map">
      <div class="map-container">
        <template v-for="(room, index) in rooms" :key="room.id">
          <div class="room-wrapper">
            <RoomNode
              :room="room"
              :is-current="index === currentRoom"
              :is-locked="index > currentRoom"
              :class="{ 'clickable': index === currentRoom + 1 }"
              @click="handleRoomClick(index)"
              @node-click="handleNodeClick"
            />
          </div>
          <PathConnection v-if="index < rooms.length - 1" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dungeon-page {
  min-width: 100vw;
  min-height: 100vh;
  background-image: url('../assets/background.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
}

.dungeon-map {
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  position: relative;
  padding: 1rem;
}

.room-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.clickable {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
  }
}
</style>