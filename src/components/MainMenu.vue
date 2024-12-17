<template>
  <div class="main-menu">
    <h1>简单卡牌</h1>
    <p>浏览器上的卡牌游戏</p>
    <div class="menu-box">
      <button @click="play">开始游戏</button>
      <button @click="newgame">新游戏</button>
      <button @click="leaderboard">排行榜</button>
      <button @click="logout">退出账号</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

async function newgame() {
  try {
    const response = await fetch('http://localhost:8080/api/game/newgame', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('New game response:', data); // 打印响应数据

    if (response.ok) {
      // 请求成功后跳转到新游戏页面
      router.push('/dungeon');
    } else {
      console.error('Failed to start new game:', data.message);
    }
  } catch (error) {
    console.error('Error starting new game:', error);
  }
}

function play() {
  router.push('/dungeon');
}

async function logout() {
  try {
    const response = await fetch('http://localhost:8080/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }
  router.push('/login');
}

function leaderboard() {
  router.push('/leaderboard');
}
</script>

<style scoped>
.main-menu {
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
}

button {
  display: block;
  width: 200px;
  margin: 10px auto;
  padding: 10px;
  font-size: 16px;
  background-color: #add8e6;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #87ceeb;
}

.link {
  color: #333;
  text-decoration: none;
  font-size: 14px;
}

.link:hover {
  text-decoration: underline;
}
</style> 