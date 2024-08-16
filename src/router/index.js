import AboutView from '@/views/AboutView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TaskCreate from '../views/task/CreateView.vue'
import TaskUpdate from '../views/task/UpdateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/logout',
      name: 'logout',
      component: LoginView
    },
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/newtask',
      name: 'newtask',
      component: TaskCreate
    },
    {
      path: '/tasks/:id/update',
      name: 'taskUpdate',
      component: TaskUpdate
    },
  ]
})

export default router
