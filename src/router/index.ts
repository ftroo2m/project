import { createRouter, createWebHistory } from 'vue-router'
import MainMenu from '../components/MainMenu.vue'
import DungeonMap from '../components/DungeonMap.vue'
import BattleView from '../components/BattleView.vue'
import Login from '../components/login.vue'
import Register from '../components/register.vue'
import Leaderboard from '../components/Leaderboard.vue'

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'index',
    component: MainMenu
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
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: Leaderboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const hasCookie = document.cookie.includes('playerID')

  if (hasCookie) {
    if (to.path === '/login' || to.path === '/register') {
      next('/dungeon')
    } else if (to.path === '/index') {
      next()
    } else if (to.path === '/battle' && from.path !== '/dungeon') {
      next('/dungeon')
    } else {
      next()
    }
  } else {
    if (to.path === '/dungeon' || to.path === '/battle' || to.path === '/index') {
      next('/login')
    } else {
      next()
    }
  }
})

export default router