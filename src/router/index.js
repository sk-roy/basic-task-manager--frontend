import ProfileView from '@/views/auth/ProfileView.vue'
import LoginView from '@/views/auth/LoginView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TaskCreate from '../views/task/CreateView.vue'
import TaskUpdate from '../views/task/UpdateView.vue'
import TaskDetails from '../views/task/DetailsView.vue'

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
      path: '/profile',
      name: 'profile',
      component: ProfileView
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
    {
      path: '/tasks/:id/details',
      name: 'taskDetails',
      component: TaskDetails
    },
  ]
})

export default router
