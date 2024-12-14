<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { GameState } from '../types/game'
import type { Card } from '../types/game'
import Character from '../components/Character.vue'
import Monster from '../components/Monster.vue'
import Hand from '../components/Hand.vue'
import PlayArea from '../components/PlayArea.vue'
import { gameSocket } from '../services/gameSocket'

const handRef = ref<InstanceType<typeof Hand> | null>(null)
const playerHp = ref(0)
const playerEnergy = ref(0)
const monsterHp = ref(0)
const monsterIntent = ref('')
const cards = ref<Card[]>([])

const handleGameState = async (state: GameState) => {
  playerHp.value = state.player.hp
  playerEnergy.value = state.player.energy
  monsterHp.value = state.monster.hp
  monsterIntent.value = `${state.monster.actionName} ${state.monster.actionValue}`
  
  // 更新卡牌
  if (state.player.newCard) {
    cards.value = state.player.newCard.map(card => card.data.card)
  }
}

// 在组件挂载时连接 WebSocket
onMounted(() => {
  gameSocket.connect('roomId', handleGameState)
})

const endTurn = () => {
  console.log('回合结束')
}
</script>

<template>
  <div class="battle-screen">
    <div class="battle-area">
      <Character 
        :health="playerHp" 
        :max-health="playerHp" 
        :block="0"
      />
      <PlayArea :is-active="handRef?.playAreaActive || false" />
      <Monster 
        :health="monsterHp" 
        :max-health="monsterHp" 
        :intent="monsterIntent" 
      />
    </div>
    <div class="energy-display">{{ playerEnergy }}/3</div>
    <Hand ref="handRef" :cards="cards" />
    <button class="end-turn-button" @click="endTurn">
      结束回合
    </button>
  </div>
</template>

<style scoped>
.battle-screen {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to bottom, #2c3e50, #3498db);
  overflow: hidden;
  user-select: none;
}

.battle-area {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 4rem;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
}

.energy-display {
  position: fixed;
  left: 2rem;
  bottom: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: #FFD700;
  padding: 1rem;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.end-turn-button {
  position: fixed;
  right: 2rem;
  bottom: 50%;
  padding: 1rem 2rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
}

.end-turn-button:hover {
  background: #c0392b;
}

.end-turn-button:active {
  transform: scale(0.95);
}
</style>