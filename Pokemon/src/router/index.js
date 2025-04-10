import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/pokedex',
    name: 'Pokedex',
    component: () => import('../views/Pokedex.vue')
  },
  {
    path: '/battle',
    name: 'Battle',
    component: () => import('../views/Battle.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
