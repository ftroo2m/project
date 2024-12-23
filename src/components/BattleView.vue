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

// 组件引用和状态管理
const handRef = ref<InstanceType<typeof Hand> | null>(null)
// 玩家相关状态
const playerHp = ref(0)          // 玩家生命值
const playerEnergy = ref(0)      // 玩家能量
const playerBlock = ref(0)       // 玩家护甲
const playerPower = ref<{ [key: string]: number | undefined }>({})  // 玩家状态效果
const playerImage = ref('')      // 玩家图片

// 怪物相关状态
const monsterHp = ref(0)         // 怪物当前生命值
const monsterMaxHp = ref(0)      // 怪物最大生命值
const monsterIntent = ref('')    // 怪物意图
const monsterBlock = ref(0)      // 怪物护甲
const monsterPower = ref<{ [key: string]: number | undefined }>({})  // 怪物状态效果
const monsterImage = ref('')     // 怪物图片

// 卡牌相关状态
const cards = ref<any[]>([])     // 手牌列表
const currentDraggingCard = ref<string | null>(null)  // 当前拖拽的卡牌

// 游戏结果状态
const showVictory = ref(false)   // 是否显示胜利画面
const showLose = ref(false)      // 是否显示失败画面
const victoryCards = ref<Card[]>([])  // 胜利获得的卡牌

// 处理游戏状态更新
const handleGameState = async (state: GameState) => {
  // 更新玩家状态
  playerHp.value = state.player.hp
  playerEnergy.value = state.player.energy
  playerBlock.value = state.player.block || 0
  
  // 初始化状态处理
  if (state.type === 'initReturn') {
    monsterMaxHp.value = state.monster.hp
    playerImage.value = state.player.image
    monsterImage.value = state.monster.image
  }
  
  // 更新怪物状态
  monsterHp.value = state.monster.hp
  monsterBlock.value = state.monster.block || 0
  
  // 处理怪物状态效果
  const monsterPowerData = state.monster.power || {}
  monsterPower.value = Object.fromEntries(
    Object.entries(monsterPowerData).filter(([_, value]) => value !== undefined)
  ) as { [key: string]: number }
  
  // 处理玩家状态效果
  const playerPowerData = state.player.power || {}
  playerPower.value = Object.fromEntries(
    Object.entries(playerPowerData).filter(([_, value]) => value !== undefined)
  ) as { [key: string]: number }

  // 更新怪物意图
  monsterIntent.value = `${state.monster.actionName} ${state.monster.actionValue}`
  
  // 处理新获得的卡牌
  if (state.player.newCard && Array.isArray(state.player.newCard) && state.player.newCard.length > 0) {
    const validCards = state.player.newCard.filter((card): card is CardResponse => {
      return typeof card === 'object' && card !== null && 'data' in card && 'card' in card.data
    })
    cards.value = [...cards.value, ...validCards.map(cardData => cardData.data.card)]
  }

  // 处理战斗结果
  if (state.type === 'monsterDeath') {
    showVictory.value = true
    if (state.player.newCard && Array.isArray(state.player.newCard)) {
      victoryCards.value = state.player.newCard.map(cardData => cardData.data.card)
    }
  }

  if (state.type === 'playerDeath') {
    showLose.value = true
  } 
}

// 生命周期钩子
onMounted(() => {
  gameSocket.connect(handleGameState)
})

onUnmounted(() => {
  gameSocket.disconnect()
})

// 结束回合处理
const endRound = () => {
  gameSocket.send({
    type: 'endRound'
  })
}

// 卡牌拖拽相关处理
const handleDragStart = (cardName: string) => {
  currentDraggingCard.value = cardName
}

const handleDragEnd = () => {
  currentDraggingCard.value = null
}

// 卡牌使用处理
const handleCardPlayed = () => {
  if (currentDraggingCard.value) {
    const index = cards.value.findIndex(card => card.Name === currentDraggingCard.value)
    if (index !== -1) {
      cards.value.splice(index, 1)  // 从手牌中移除使用的卡牌
    }
  }
  currentDraggingCard.value = null
}
</script>

<template>
  <div class="battle-screen">
    <!-- 战斗区域 -->
    <div class="battle-area">
      <!-- 玩家角色 -->
      <Character 
        :health="playerHp" 
        :block="playerBlock"
        :power="playerPower"
        :image="playerImage"
      />
      <!-- 卡牌使用区域 -->
      <PlayArea 
        :is-active="handRef?.playAreaActive || false"
        :current-card="currentDraggingCard?.toString()"
        :player-energy="playerEnergy"
        :cards="cards"
        @card-played="handleCardPlayed"
      />
      <!-- 怪物 -->
      <Monster 
        :health="monsterHp" 
        :max-health="monsterMaxHp"
        :block="monsterBlock"
        :intent="monsterIntent" 
        :power="monsterPower"
        :image="monsterImage"
      />
    </div>
    <!-- 能量显示 -->
    <div class="energy-display">{{ playerEnergy }}/3</div>
    <!-- 手牌区域 -->
    <Hand ref="handRef" :cards="cards" @drag-start="handleDragStart" @drag-end="handleDragEnd" />
    <!-- 结束回合按钮 -->
    <button class="end-turn-button" @click="endRound">
      结束回合
    </button>
    <!-- 战斗结果画面 -->
    <VictoryScreen 
      v-if="showVictory"
      :new-cards="victoryCards"
    />
    <LoseScreen 
      v-if="showLose"
    />
  </div>
</template>

<style scoped>
/* 战斗场景容器 */
.battle-screen {
  background-image: url('../assets/battle.jpeg');
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  overflow: hidden;
  user-select: none;
}

/* 战斗区域布局 */
.battle-area {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 4rem;
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
}

/* 能量显示样式 */
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

/* 结束回合按钮样式 */
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

/* 结束回合按钮悬停效果 */
.end-turn-button:hover {
  background: #c0392b;
}

/* 结束回合按钮点击效果 */
.end-turn-button:active {
  transform: scale(0.95);
}
</style>