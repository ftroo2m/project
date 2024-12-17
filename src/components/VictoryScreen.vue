<script setup lang="ts">
import type { Card } from '../types/game'
import { useRouter } from 'vue-router'

const router = useRouter()
defineProps<{
  newCards: Card[]
}>()

const handleClose = () => {
  router.push('/dungeon')
}
</script>

<template>
  <div class="victory-screen">
    <button class="close-button" @click="handleClose">×</button>
    <h1 class="victory-text">YOU WIN</h1>
    <div class="rewards">
      <h2>获得卡牌：</h2>
      <div class="cards-container">
        <div v-for="card in newCards" :key="card.ID" class="card">
          <div class="card-cost">{{ card.Energy }}</div>
          <div class="card-image" v-if="card.Image">
            <img :src="`data:image/jpeg;base64,${card.Image}`" alt="card image" />
          </div>
          <div class="card-content">
            <h3 class="card-name">{{ card.Name }}</h3>
            <p class="card-description">{{ card.Description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.victory-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.victory-text {
  font-size: 5rem;
  color: gold;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  animation: pulse 2s infinite;
}

.rewards {
  margin-top: 2rem;
  text-align: center;
}

.rewards h2 {
  color: white;
  margin-bottom: 1rem;
}

.cards-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.card {
  width: 150px;
  height: 200px;
  background: #2a2a2a;
  border: 2px solid gold;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  animation: slideUp 0.5s ease-out;
}

.card-image {
  width: 100%;
  height: 100px;
  overflow: hidden;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 0.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.8);
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
  color: white;
  z-index: 2;
}

.card-name {
  margin: 0.3rem 0;
  text-align: center;
  color: #fff;
  font-size: 0.9rem;
}

.card-description {
  font-size: 0.7rem;
  color: #ccc;
  text-align: center;
  margin: 0;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid gold;
  background: transparent;
  color: gold;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-button:hover {
  background: gold;
  color: black;
  transform: scale(1.1);
}

.close-button:active {
  transform: scale(0.95);
}
</style> 