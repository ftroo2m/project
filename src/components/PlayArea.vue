<script setup lang="ts">
defineProps<{
  isActive: boolean
}>()
</script>

<template>
  <div class="play-area" :class="{ active: isActive }">
    <div class="play-area-text" v-if="isActive">
      Release to Play Card
    </div>
  </div>
</template>

<style scoped>
.play-area {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 100px;
  border-radius: 15px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: 0;
  pointer-events: none;
}

.play-area.active {
  opacity: 1;
  border-color: rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.1);
}

.play-area-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
}
</style>