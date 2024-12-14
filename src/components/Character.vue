<script setup lang="ts">
defineProps<{
  health: number
  maxHealth: number
  block: number
}>()
</script>

<template>
  <div class="character">
    <div class="character-sprite">🧙‍♂️</div>
    <div class="stats">
      <div class="health">HP: {{ health }}/{{ maxHealth }}</div>
      <div v-if="block > 0" class="block">Block: {{ block }}</div>
    </div>
  </div>
</template>

<style scoped>
.character {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.character-sprite {
  font-size: 4rem;
}

.stats {
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5rem;
  border-radius: 0.5rem;
  text-align: center;
  color: white;
}

.block {
  color: #4a9eff;
}
</style>