<template>
  <div class="leaderboard">
    <button class="back-button" @click="backToMenu">返回主菜单</button>
    <h1>排行榜</h1>
    <div class="menu-box">
      <table>
        <thead>
          <tr>
            <th>排名</th>
            <th>玩家</th>
            <th>通关次数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in players" :key="player.playerID">
            <td>{{ index + 1 }}</td>
            <td>{{ player.playerID }}</td>
            <td>{{ player.counts }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 添加玩家数据接口
interface Player {
  playerID: string
  counts: number
}

const router = useRouter()
const players = ref<Player[]>([])  // 添加类型注解

async function fetchLeaderboard() {
  try {
    const response = await fetch('http://localhost:8080/api/game/leaderboard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })

    const result = await response.json()
    if (result.code === 200) {
      players.value = result.data.leaderboard
    } else {
      console.error('Failed to fetch leaderboard:', result.message)
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
  }
}

function backToMenu() {
  router.push('/')
}

onMounted(() => {
  fetchLeaderboard()
})
</script>

<style scoped>
.leaderboard {
  background-image: url('../assets/index.jpeg');
  background-size: cover;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #f0c040;
  text-align: center;
}

.menu-box {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  font-size: 16px;
  color: #f0c040;
}

th {
  background-color: #333;
}

tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.1);
}

tr:hover {
  background-color: rgba(255, 255, 255, 0.2);
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
</style> 