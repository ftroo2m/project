<template>
  <div class="card-library">
    <button class="library-button" @click="toggleLibrary">
      <span class="button-icon">📚</span>
      <span class="button-text">牌库</span>
    </button>
    <div v-if="isVisible" class="library-overlay">
      <div class="library">
        <div class="library-header">
          <h2 class="library-title">你的牌库</h2>
          <button class="close-button" @click="toggleLibrary">×</button>
        </div>
        <div class="cards-container">
          <div 
            v-for="card in cards" 
            :key="card.ID" 
            class="card"
            @contextmenu.prevent
            @selectstart.prevent
            @copy.prevent
            @dragstart.prevent
          >
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Card } from '../types/game'

const props = defineProps<{
  cards: Card[]
}>()

const isVisible = ref(false)

const toggleLibrary = () => {
  isVisible.value = !isVisible.value
}
</script>

<style scoped>
.card-library {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
}

.library-button {
  position: fixed;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  z-index: 1000;
  padding: 12px 24px;
  background: linear-gradient(135deg, #4a9eff, #2d5ca5);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.button-icon {
  font-size: 20px;
}

.library-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow: hidden;
}

.library {
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
  border-radius: 16px;
  padding: 2rem;
  width: 90vw;
  max-width: 1200px;
  max-height: 90vh;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow: hidden;
}

.library-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.library-title {
  color: white;
  font-size: 1.8rem;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.close-button {
  background: transparent;
  border: none;
  color: white;
  font-size: 28px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
  max-height: calc(90vh - 150px);
}

.card {
  width: 150px;
  height: 200px;
  background: #2a2a2a;
  border: 2px solid #4a4a4a;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  padding: 0;
  overflow: hidden;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
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
</style>
