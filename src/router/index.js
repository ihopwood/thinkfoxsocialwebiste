import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import vOnWingDetail from '@/View/vOnWingDetail.vue'
import vAetherCupDetail from '@/View/vAetherCupDetail.vue'
import vCompanyOfAshDetail from '@/View/vCompanyOfAshDetail.vue'
import vStore from '@/View/vStore.vue'
import vBlog from '@/View/vBlog.vue'
import vArmyBuilder from '@/View/vArmyBuilder.vue'
import vCombatCalc from '@/View/vCombatCalc.vue'

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
      path: '/aethercup',
      name: 'aethercup',
      component: vAetherCupDetail,
    },
    {
      path: '/companyofash',
      name: 'companyofash',
      component: vCompanyOfAshDetail,
    },
    {
      path: '/store',
      name: 'store',
      component: vStore,
    },
    {
      path: '/blog',
      name: 'blog',
      component: vBlog,
    },
    {
      path: '/armybuilder',
      name: 'armybuilder',
      component: vArmyBuilder,
    },
    {
      path: '/combatcalc',
      name: 'combatcalc',
      component: vCombatCalc,
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 88 }
    }
    return { top: 0 }
  }
})

export default router
