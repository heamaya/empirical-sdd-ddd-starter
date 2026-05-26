import { createRouter, createWebHistory } from 'vue-router'
import PlayList from './components/PlayList.vue'
import PlayDetail from './components/PlayDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: PlayList },
    { path: '/plays/:id', component: PlayDetail },
  ],
})

export default router
