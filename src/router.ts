import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './views/Home.vue'
export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home },
    { path: '/dog/new', component: () => import('./views/DogForm.vue') },
    { path: '/dog/:id', component: () => import('./views/DogCard.vue') },
    { path: '/dog/:id/edit', component: () => import('./views/DogForm.vue') },
    { path: '/dog/:id/record', component: () => import('./views/RecordForm.vue') },
  ],
})
