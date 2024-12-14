import { createRouter, createWebHistory } from 'vue-router'
import DungeonMap from '../components/DungeonMap.vue'
import BattleView from '../components/BattleView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dungeon'
    },
    {
      path: '/dungeon',
      name: 'dungeon',
      component: DungeonMap
    },
    {
      path: '/battle',
      name: 'battle',
      component: BattleView
    }
  ]
})

export default router