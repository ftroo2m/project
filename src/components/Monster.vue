<script setup lang="ts">
defineProps<{
  health: number
  maxHealth: number
  intent: string
}>()
</script>

<template>
  <div class="monster">
    <div class="intent">{{ intent }}</div>
    <div class="monster-sprite">👾</div>
    <div class="stats">
      <div class="health">HP: {{ health }}/{{ maxHealth }}</div>
    </div>
  </div>
</template>

<style scoped>
.monster {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.monster-sprite {
  font-size: 4rem;
}

.stats {
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: white;
}

.intent {
  background: rgba(255, 0, 0, 0.3);
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: white;
}
</style>