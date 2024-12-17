<script setup lang="ts">
defineProps<{
  name: string
  cost: number
  description: string
  image?: string
}>()
</script>

<template>
  <div class="card">
    <div class="card-image" v-if="image">
      <img :src="`data:image/jpeg;base64,${image}`" alt="card image" />
    </div>
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

.card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  border-radius: 10px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.3;
}

.card-cost,
.card-name,
.card-description {
  position: relative;
  z-index: 1;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
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