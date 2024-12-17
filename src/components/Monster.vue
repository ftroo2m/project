<script setup lang="ts">
interface Power {
  poison?: number
  weak?: number
  vulnerable?: number
  regen?: number
}

defineProps<{
  health: number
  maxHealth: number
  intent: string
  block: number
  power?: Power
  image?: string
}>()
</script>

<template>
  <div class="monster">
    <div class="intent">{{ intent }}</div>
    <div class="monster-sprite">
      <img v-if="image" :src="`data:image/jpeg;base64,${image}`" alt="monster" />
      <span v-else>👾</span>
    </div>
    <div class="stats">
      <div class="health">生命值: {{ health }}/{{ maxHealth }}</div>
      <div v-if="block > 0" class="block">护甲: {{ block }}</div>
      <div v-if="power" class="powers">
        <div v-if="power.poison" class="power poison">中毒: {{ power.poison }}</div>
        <div v-if="power.weak" class="power weak">虚弱: {{ power.weak }}</div>
        <div v-if="power.vulnerable" class="power vulnerable">易伤: {{ power.vulnerable }}</div>
        <div v-if="power.regen" class="power regen">恢复: {{ power.regen }}</div>
      </div>
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
  width: 120px;
  height: 213px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.monster-sprite img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
  border: 2px solid #e74c3c;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.monster-sprite span {
  font-size: 4rem;
}

.stats {
  background: rgba(0, 0, 0, 0.7);
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: white;
}

.block {
  color: #4a9eff;
}

.intent {
  background: rgba(255, 0, 0, 0.3);
  padding: 0.5rem;
  border-radius: 0.5rem;
  color: white;
}

.powers {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.power {
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
  font-size: 0.8rem;
}

.poison {
  background: #4a9d4a;
}

.weak {
  background: #9d4a4a;
}

.vulnerable {
  background: #9d4a9d;
}

.regen {
  background: #4a4a9d;
}
</style>