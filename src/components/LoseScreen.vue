<script setup lang="ts">
import type { Card } from '../types/game'
import { useRouter } from 'vue-router'

const router = useRouter()
defineProps<{
  newCards: Card[]
}>()

const handleClose = () => {
  router.push('/index')
}
</script>

<template>
  <div class="victory-screen">
    <button class="close-button" @click="handleClose">×</button>
    <h1 class="victory-text">YOU DEAD</h1>
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
  color: gray;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
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
  padding: 1rem;
  position: relative;
  animation: slideUp 0.5s ease-out;
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
  border: 2px solid gray;
  background: transparent;
  color: gray;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-button:hover {
  background: gray;
  color: black;
  transform: scale(1.1);
}

.close-button:active {
  transform: scale(0.95);
}
</style> 