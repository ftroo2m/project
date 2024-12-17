<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { gameSocket } from '../services/gameSocket'
import { getRoomIcon } from '../utils/roomUtils'
import type { Room } from '../types/room'

// 定义组件的 props
const props = defineProps<{
  id: number                                    // 房间ID
  room?: Room                                   // 房间信息
  isCurrent?: boolean                          // 是否是当前可访问的房间
  isLocked?: boolean                           // 是否被锁定
  class?: string | Record<string, boolean>     // 自定义类名
}>()

const router = useRouter()

// 处理房间节点点击事件
const handleNodeClick = () => {
  // 如果房间被锁定，则不处理点击事件
  if (props.isLocked) return
  
  // 连接到对应房间的 WebSocket
  gameSocket.connect(`room${props.id}`, (state) => {
    console.log('Connected to room:', props.id)
    router.push(`/battle/${props.id}`)
  })
}
</script>

<template>
  <div 
    class="room-node"
    :class="[
      {
        'current': isCurrent,    // 当前可访问的房间样式
        'completed': room?.completed,  // 已完成的房间样式
        'locked': isLocked,      // 锁定的房间样式
        'active': isCurrent && !isLocked  // 当前激活的房间样式
      },
      props.class
    ]"
  >
    <!-- 房间内容显示 -->
    <div class="room-content">
      <span class="room-icon">{{ room?.type ? getRoomIcon(room.type) : `Room ${id}` }}</span>
    </div>
    <!-- 悬停提示框 -->
    <div class="room-tooltip">
      <!-- 房间类型显示 -->
      <div class="room-type">
        {{ room?.type === 'monster' ? '普通怪物' :
           room?.type === 'elite' ? '精英怪物' :
           room?.type === 'boss' ? 'Boss' :
           room?.type === 'bonfire' ? '休息处' : ''
        }}
      </div>
      <!-- 房间描述显示 -->
      <div class="room-description">
        {{ room?.type === 'monster' ? '与普通怪物战斗' :
           room?.type === 'elite' ? '与精英怪物战斗' :
           room?.type === 'boss' ? '与Boss战斗' :
           room?.type === 'bonfire' ? '恢复20点生命值' : ''
        }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 房间节点基础样式 */
.room-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

/* 房间内容容器样式 */
.room-content {
  background-color: #2a2a2a;
  border: 2px solid #666;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

/* 房间图标样式 */
.room-icon {
  font-size: 1.5rem;
}

/* 提示框样式 */
.room-tooltip {
  position: absolute;
  left: 70px;
  background-color: #333;
  padding: 0.8rem;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  width: 150px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border: 1px solid #666;
}

/* 悬停时显示提示框 */
.room-node:hover .room-tooltip {
  opacity: 1;
}

/* 房间类型文本样式 */
.room-type {
  text-transform: capitalize;
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: #4a9eff;
}

/* 房间描述文本样式 */
.room-description {
  font-size: 0.8rem;
  color: #ccc;
}

/* 当前房间样式 */
.current .room-content {
  box-shadow: 0 0 15px #4a9eff;
  transform: scale(1.1);
  border-color: #4a9eff;
}

/* 已完成房间样式 */
.completed .room-content {
  opacity: 0.7;
  border-color: #4caf50;
}

/* 锁定房间样式 */
.locked .room-content {
  opacity: 0.5;
  filter: grayscale(1);
}

/* 脉冲动画定义 */
@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 15px #4a9eff,
                0 0 15px #ffd700;
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 25px #4a9eff,
                0 0 25px #ffd700;
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 15px #4a9eff,
                0 0 15px #ffd700;
  }
}

/* 激活状态的房间样式 */
.active .room-content {
  animation: pulse 1.5s infinite ease-in-out;
  border-color: #4a9eff;
}

/* 悬停时暂停动画 */
.active .room-content:hover {
  animation-play-state: paused;
}
</style>