<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { GameState, CardResponse, Card } from '../types/game'
import Character from '../components/Character.vue'
import Monster from '../components/Monster.vue'
import Hand from '../components/Hand.vue'
import PlayArea from '../components/PlayArea.vue'
import { gameSocket } from '../services/gameSocket'
import VictoryScreen from './VictoryScreen.vue'
import LoseScreen from './LoseScreen.vue'

const handRef = ref<InstanceType<typeof Hand> | null>(null)
const playerHp = ref(0)
const playerEnergy = ref(0)
const playerBlock = ref(0)
const monsterHp = ref(0)
const monsterMaxHp = ref(0)
const monsterIntent = ref('')
const monsterBlock = ref(0)
const cards = ref<any[]>([])
const currentDraggingCard = ref<string | null>(null)
const monsterPower = ref<{ [key: string]: number | undefined }>({})
const showVictory = ref(false)
const showLose = ref(false)
const victoryCards = ref<Card[]>([])
const playerPower = ref<{ [key: string]: number | undefined }>({})
const playerImage = ref('')
const monsterImage = ref('')

const handleGameState = async (state: GameState) => {
  playerHp.value = state.player.hp
  playerEnergy.value = state.player.energy
  playerBlock.value = state.player.block || 0
  if (state.type === 'initReturn') {
    monsterMaxHp.value = state.monster.hp
    playerImage.value = state.player.image
    monsterImage.value = state.monster.image
  }
  monsterHp.value = state.monster.hp
  monsterBlock.value = state.monster.block || 0
  
  // 处理怪物状态
  const monsterPowerData = state.monster.power || {}
  monsterPower.value = Object.fromEntries(
    Object.entries(monsterPowerData).filter(([_, value]) => value !== undefined)
  ) as { [key: string]: number }
  
  // 处理玩家状态
  const playerPowerData = state.player.power || {}
  playerPower.value = Object.fromEntries(
    Object.entries(playerPowerData).filter(([_, value]) => value !== undefined)
  ) as { [key: string]: number }

  if (state.type === 'initReturn') {
    monsterMaxHp.value = state.monster.hp
  }
  monsterIntent.value = `${state.monster.actionName} ${state.monster.actionValue}`
  
  if (state.player.newCard && Array.isArray(state.player.newCard) && state.player.newCard.length > 0) {
    // 使用类型守卫确保数据类型正确
    const validCards = state.player.newCard.filter((card): card is CardResponse => {
      return typeof card === 'object' && card !== null && 'data' in card && 'card' in card.data
    })
    // 将新卡牌添加到现有手牌中
    cards.value = [...cards.value, ...validCards.map(cardData => cardData.data.card)]
  }

  if (state.type === 'monsterDeath') {
    showVictory.value = true
    if (state.player.newCard && Array.isArray(state.player.newCard)) {
      victoryCards.value = state.player.newCard.map(cardData => cardData.data.card)
    }
  }

  if (state.type === 'playerDeath') {
    showLose.value = true
    console.log('showLose', showLose.value)
  } 
}

// 在组件挂载时连接 WebSocket
onMounted(() => {
  gameSocket.connect('roomId', handleGameState)
})

onUnmounted(() => {
  gameSocket.disconnect()
})

const endRound = () => {
  gameSocket.send({
    type: 'endRound'
  })
}

const handleDragStart = (cardName: string) => {
  currentDraggingCard.value = cardName
}

const handleDragEnd = () => {
  currentDraggingCard.value = null
}

const handleCardPlayed = () => {
  if (currentDraggingCard.value) {
    const index = cards.value.findIndex(card => card.Name === currentDraggingCard.value)
    if (index !== -1) {
      cards.value.splice(index, 1)
    }
  }
  currentDraggingCard.value = null
}
</script>

<template>
  <div class="battle-screen">
    <div class="battle-area">
      <Character 
        :health="playerHp" 
        :block="playerBlock"
        :power="playerPower"
        :image="playerImage"
      />
      <PlayArea 
        :is-active="handRef?.playAreaActive || false"
        :current-card="currentDraggingCard?.toString()"
        :player-energy="playerEnergy"
        :cards="cards"
        @card-played="handleCardPlayed"
      />
      <Monster 
        :health="monsterHp" 
        :max-health="monsterMaxHp"
        :block="monsterBlock"
        :intent="monsterIntent" 
        :power="monsterPower"
        :image="monsterImage"
      />
    </div>
    <div class="energy-display">{{ playerEnergy }}/3</div>
    <Hand ref="handRef" :cards="cards" @drag-start="handleDragStart" @drag-end="handleDragEnd" />
    <button class="end-turn-button" @click="endRound">
      结束回合
    </button>
    <VictoryScreen 
      v-if="showVictory"
      :new-cards="victoryCards"
    />
    <LoseScreen 
      v-if="showLose"
      :new-cards="victoryCards"
    />
  </div>
</template>

<style scoped>
.battle-screen {
  background-image: url('../assets/battle.jpeg');
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
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
  background: rgb(153, 153, 153);
  color: #ffd900;
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