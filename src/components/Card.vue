<script setup lang="ts">
defineProps<{
  name: string
  cost: number
  description: string
}>()
</script>

<template>
  <div class="card">
    <div class="card-cost">{{ cost }}</div>
    <h3 class="card-name">{{ name }}</h3>
    <p class="card-description">{{ description }}</p>
  </div>
</template>

<style scoped>
.card {
  width: 150px;
  height: 200px;
  background: #2a2a2a;
  border: 2px solid #4a4a4a;
  border-radius: 10px;
  padding: 1rem;
  position: relative;
  transition: transform 0.2s;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-20px);
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
}

.card-name {
  margin-top: 1.5rem;
  text-align: center;
  color: #fff;
}

.card-description {
  font-size: 0.8rem;
  color: #ccc;
  text-align: center;
  margin-top: 1rem;
}
</style>