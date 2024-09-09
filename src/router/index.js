import LoginView from '@/views/auth/LoginView.vue'
import ProfileView from '@/views/auth/ProfileView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TaskCreate from '../views/task/CreateView.vue'
import TaskDetails from '../views/task/DetailsView.vue'
import TaskUpdate from '../views/task/UpdateView.vue'
import NotificationsView from '@/views/notification/NotificationsView.vue'
import apiClient from "../plugins/axios"
import RegisterView from '@/views/auth/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'registration',
      component: RegisterView,
    },
    {
      path: '/logout',
      name: 'logout',
      component: LoginView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home - Task Manager',
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        title: 'Profile - Task Manager',
        requiresAuth: true
      }
    },
    {
      path: '/newtask',
      name: 'newtask',
      component: TaskCreate,
      meta: {
        title: 'Add New Task - Task Manager',
        requiresAuth: true
      }
    },
    {
      path: '/tasks/:id/update',
      name: 'taskUpdate',
      component: TaskUpdate,
      meta: {
        title: 'Task Update - Task Manager',
        requiresAuth: true
      }
    },
    {
      path: '/tasks/:id/details',
      name: 'taskDetails',
      component: TaskDetails,
      meta: {
        title: 'Task Details - Task Manager',
        requiresAuth: true
      }
    },
    {
      path: '/notification',
      name: 'notification',
      component: NotificationsView,
      meta: {
        title: 'Notification - Task Manager',
        requiresAuth: true
      }
    },
  ]
})


const getTokenFromCookie = () => {
  const name = "auth_token=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
}


export const checkAuth = async () => {
  try {
    const response = await apiClient.get('/check-auth');
    return true;
  } catch (error) {
    return false;
  }
}


router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Task Manager';
  if (to.meta.requiresAuth) {
    checkAuth().then(authenticated => {
      if (authenticated) {
        next();
      } else {
        next('/login');
      }
    }).catch(error => {
      console.error('Error checking authentication:', error);
      next('/login');
    });
  } else {
    next();
  }
});

export default router;
