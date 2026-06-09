import { createRouter, createWebHistory } from 'vue-router'
import {useSettingsStore} from "../stores/settings.ts"
import HomeView from '../pages/HomeView.vue'
import {supabase} from "../supabase.ts";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeView },
    { path: '/login', component: () => import('../pages/LoginView.vue') },
    { path: '/register', component: () => import('../pages/RegisterView.vue') },
    { path: '/dashboard', component: () => import('../pages/DashboardView.vue'), meta: { requiresAuth: true }  },
    { path: '/session/new', component: () => import('../pages/SessionNewView.vue'),meta: { requiresAuth: true } },
    { path: '/session/:id', component: () => import('../pages/SessionDetailView.vue'), meta: { requiresAuth: true } },
    { path: '/stats', component: () => import('../pages/StatsView.vue'), meta: { requiresAuth: true } },
    { path: '/profile', component: () => import('../pages/ProfileView.vue'), meta: { requiresAuth: true } },
  ],
})

router.beforeEach(async (to) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    return '/login'
  }

  if ((to.path === '/login' || to.path === '/register') && session) {
    return '/dashboard'
  }

  if (session?.user) {
    const settings = useSettingsStore()
    if (!settings.loaded) {
      await settings.fetchSettings()
    }
  }
})

export default router
