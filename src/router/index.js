import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import vOnWingDetail from '@/View/vOnWingDetail.vue'
import vCompanyOfAshDetail from '@/View/vCompanyOfAshDetail.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/onwings',
      name: 'onwings',
      component: vOnWingDetail,
    },
    {
      path: '/companyofash',
      name: 'companyofash',
      component: vCompanyOfAshDetail,
    },

  ],
})

export default router
