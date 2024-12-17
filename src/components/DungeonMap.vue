<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Room } from '../types/room';
import type { Card } from '../types/game';
import RoomNode from './RoomNode.vue';
import PathConnection from './PathConnection.vue';
import CardLibrary from './CardLibrary.vue';
import { useRouter } from 'vue-router';

interface MapNode {
  ID: number
  Name: string
  Visit: number
}

// 将 rooms 改为 ref
const rooms = ref<Room[]>([
  { id: 0, type: 'monster', completed: false },
  { id: 1, type: 'monster', completed: false },
  { id: 2, type: 'monster', completed: false },
  { id: 3, type: 'bonfire', completed: false },
  { id: 4, type: 'elite', completed: false },
  { id: 5, type: 'elite', completed: false },
  { id: 6, type: 'bonfire', completed: false },
  { id: 7, type: 'boss', completed: false }
]);

const currentRoomId = ref(0);
const router = useRouter();

const fetchMapData = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/game/map', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    
    if (data.code === 200 && data.data.nodes) {
      const newRooms = [...rooms.value];
      
      // 找到第一个 Visit 为 0 的房间索引
      const firstUnvisitedIndex = data.data.nodes.findIndex((node: MapNode) => node.Visit === 0);
      
      // 更新房间状态
      data.data.nodes.forEach((node: MapNode, index: number) => {
        if (node.ID < newRooms.length) {
          if (node.Visit === 1) {
            // 已访问过的房间
            newRooms[node.ID] = {
              ...newRooms[node.ID],
              completed: true
            };
          }
        }
      });
      
      // 设置当前可访问的房间
      if (firstUnvisitedIndex !== -1) {
        currentRoomId.value = data.data.nodes[firstUnvisitedIndex].ID;
      }
      
      rooms.value = newRooms;
    }
  } catch (error) {
    console.error('Failed to fetch map data:', error);
  }
};

// 添加玩家卡牌状态
const playerCards = ref<Card[]>([]);

// 添加获取单张卡牌详情的函数
const fetchCardDetail = async (cardName: string) => {
  try {
    const response = await fetch('http://localhost:8080/api/game/onecard', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: cardName })
    });
    const data = await response.json();
    if (data.code === 200) {
      return data.data.card;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch card detail:', error);
    return null;
  }
};

// 修改获取玩家卡牌的函数
const fetchPlayerCards = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/game/card', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (data.code === 200 && Array.isArray(data.data.cards)) {
      // 获取每张卡牌的详细信息
      const cardDetails = await Promise.all(
        data.data.cards.map((cardName: string) => fetchCardDetail(cardName))
      );
      // 过滤掉获取失败的卡牌
      playerCards.value = cardDetails.filter(card => card !== null);
    }
  } catch (error) {
    console.error('Failed to fetch player cards:', error);
  }
};

onMounted(() => {
  fetchMapData();
  fetchPlayerCards();
});

const canEnterRoom = (room: Room) => {
  const node = room.id < rooms.value.length ? rooms.value[room.id] : null;
  if (!node) return false;
  
  // 已完成的房间不可再次进入
  if (node.completed) return false;

  return room.id === currentRoomId.value;
};

// 添加动画状态
const showHealEffect = ref(false)
const healEffectPosition = ref({ x: 0, y: 0 })

const handleNodeClick = async (room: Room) => {
  if (!canEnterRoom(room)) {
    return;
  }

  if (room.type === 'bonfire') {
    try {
      const response = await fetch('http://localhost:8080/api/game/c/rest', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (data.code === 200) {
        // 获取点击的房间节点位置
        const roomElement = document.querySelector(`[data-room-id="${room.id}"]`)
        if (roomElement) {
          const rect = roomElement.getBoundingClientRect()
          healEffectPosition.value = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
          }
          showHealEffect.value = true
          setTimeout(() => {
            showHealEffect.value = false
          }, 1500) // 1.5秒后隐藏动画
        }
        
        rooms.value[room.id].completed = true;
        currentRoomId.value = room.id + 1;
      }
    } catch (error) {
      console.error('Failed to rest:', error);
    }
  } else {
    // 其他房间进入战斗
    rooms.value[room.id].completed = true;
    currentRoomId.value = room.id + 1;
    router.push(`/battle`);
  }
};

function backToMenu() {
  router.push('/')
}
</script>

<template>
  <div class="dungeon-page">
    <CardLibrary :cards="playerCards" />
    <div class="dungeon-map">
      <button class="back-button" @click="backToMenu">返回主菜单</button>
      <div class="map-container">
        <template v-for="(room, index) in rooms" :key="room.id">
          <div class="room-wrapper">
            <RoomNode
              :id="room.id"
              :room="room"
              :type="room.type"
              :is-current="canEnterRoom(room)"
              :class="{ 'clickable': canEnterRoom(room) }"
              @click="handleNodeClick(room)"
              :data-room-id="room.id"
            />
          </div>
          <PathConnection v-if="index < rooms.length - 1" />
        </template>
      </div>
    </div>
    <!-- 添加治疗效果动画 -->
    <div 
      v-if="showHealEffect"
      class="heal-effect"
      :style="{
        left: `${healEffectPosition.x}px`,
        top: `${healEffectPosition.y}px`
      }"
    >
      +20 HP
    </div>
  </div>
</template>

<style scoped>
.dungeon-page {
  min-width: 100vw;
  min-height: 100vh;
  background-image: url('../assets/background.jpeg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 2rem;
  position: relative;
}

.dungeon-map {
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.map-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  position: relative;
  padding: 1rem;
}

.room-wrapper {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.clickable {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
  }
  50% {
    transform: scale(1.05);
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
  }
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.3));
  }
}

.heal-effect {
  position: fixed;
  transform: translate(-50%, -50%);
  color: #2ecc71;
  font-size: 24px;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(46, 204, 113, 0.5);
  pointer-events: none;
  animation: floatUp 1.5s ease-out forwards;
  z-index: 1000;
}

@keyframes floatUp {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -150%) scale(1);
  }
}

.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 10px 20px;
  background: #4a9eff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  z-index: 100;
  transition: background 0.2s;
}

.back-button:hover {
  background: #3a7fd0;
}

.card-library {
  position: fixed;
  z-index: 1000;
}
</style>