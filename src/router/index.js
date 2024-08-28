import LoginView from '@/views/auth/LoginView.vue'
import ProfileView from '@/views/auth/ProfileView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TaskCreate from '../views/task/CreateView.vue'
import TaskDetails from '../views/task/DetailsView.vue'
import TaskUpdate from '../views/task/UpdateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        requiresAuth: false
      }
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
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/newtask',
      name: 'newtask',
      component: TaskCreate,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tasks/:id/update',
      name: 'taskUpdate',
      component: TaskUpdate,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/tasks/:id/details',
      name: 'taskDetails',
      component: TaskDetails,
      meta: {
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


router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = getTokenFromCookie();
    if (token) {
      next();
    } else {
      next('/login');
    }
  } else {
    next();
  }
});

export default router
