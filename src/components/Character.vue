<script setup lang="ts">
interface Power {
  poison?: number
  weak?: number
  vulnerable?: number
  regen?: number
}

defineProps<{
  health: number
  block: number
  power?: Power
  image?: string
}>()
</script>

<template>
  <div class="character">
    <div class="character-sprite">
      <img v-if="image" :src="`data:image/jpeg;base64,${image}`" alt="player" />
      <span v-else>🧙‍♂️</span>
    </div>
    <div class="stats">
      <div class="health">生命值: {{ health }}/72</div>
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
.character {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.character-sprite {
  width: 120px;
  height: 213px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.character-sprite img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
  border: 2px solid #4a9eff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.character-sprite span {
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