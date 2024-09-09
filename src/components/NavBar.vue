<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
        <RouterLink class="navbar-brand" to="/" v-if="loggedIn">Task Manager</RouterLink>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
                <RouterLink 
                class="nav-link active" 
                aria-current="page" 
                to="/"
                v-if="loggedIn"
                >Home</RouterLink
                >
            </li>
            <li class="nav-item">
                <RouterLink
                class="nav-link active"
                aria-current="page"
                to="/newtask"
                v-if="loggedIn"
                >New Task</RouterLink
                >
            </li>
            </ul>

            
            <form class="d-flex" role="search">
                <RouterLink
                    class="nav-link active"
                    aria-current="page"
                    to="/notification"
                    v-if="loggedIn"
                    >
                      <div class="d-flex mb-2">
                        <font-awesome-icon icon="fa-regular fa-bell" class="notification-icon" />
                        <!-- <b-avatar class="text-black bg-white">2</b-avatar> -->
                        <div class="rounded-full text-black bg-white p-1">{{ $root.notifications.length }}</div>
                      </div>
                    
                    </RouterLink
                >
                <a class="text-white text-decoration-none mx-3" href="/profile" v-if="loggedIn"> {{ user.name }} </a>
                <RouterLink
                    class="text-white text-decoration-none"
                    aria-current="page"
                    to="/login"
                    @click="logout"
                    v-if="loggedIn"
                    >Logout</RouterLink>
            </form>
        </div>
        </div>
    </nav>
</template>

<script>
  import { RouterLink, RouterView } from "vue-router";
  import apiClient from "@/plugins/axios";
  import Pusher from "pusher-js";
  import Echo from 'laravel-echo';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { faBell } from '@fortawesome/free-regular-svg-icons'; 
  
  library.add(faBell); // Add the icon to the library
  
  export default {
    name: "app",
    components: {
      FontAwesomeIcon,
    },
  
    data() {
      return {
        notificationCounter: 0,
        notifications: [],
        messages: [],
        tasks: [],
        authenticated: false,
        user: [],
        loggedIn: false,
      };
    },
  
    created() {
      this.$root.notifications = this.notifications;
      // this.checkAuth();
    },
  
    mounted() {
        this.checkAuth();
        // if(this.loggedIn) {
          this.subscribeToTaskChannels();
          this.getUser();
        // }
    },
  
    methods: {    
  
      goToNotifications() {
        this.$router.push({ name: 'notifications' }); // Navigate to the notifications page
      },
      
      async subscribeToTaskChannels() {
        const userId = 1;
        const channelName = `App.Models.User.${userId}`;
        try {

            window.Echo.channel(channelName)
              .listen('.task.update', (task) => {
                this.addNotification(task);
                // alert(task.message);
                console.log("first");
                this.notificationCounter++;
                console.log(this.notificationCounter);
                // alert(task.message);
                // this.$store.dispatch('addNotification', task);
              })
        } catch (error) {
          console.error("Error during getting task:", error);
          alert("Error during getting tasks");
        }
      },
  
      addNotification(task, message) {
        const notification = {
            id: task.id,
            message: task.message,
            timestamp: new Date().toLocaleString(),
        };
        this.notifications.push(notification);
      },

      removeCookie(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      },
  
      async logout() {
        try {
          const response = await apiClient.post("/logout");
          this.authenticated = false;
          this.removeCookie('authToken');
          this.$router.push("/login");
          this.loggedIn = false;
        } catch (error) {
          console.error("Error during logout:", error);
          alert("Error during logout");
        }
      },
  
      async getUser() {
        try {
          const response = await apiClient.get("/user");
          this.loggedIn = true;
          this.user = response.data;
        } catch (error) {
          console.error("Error to get user data:", error);
          alert("Error to get user data");
        }
      },
  
      async checkAuth() {
        try {
          const response = await apiClient.get('check-auth');
          this.loggedIn = response.data.authenticated;
          this.authenticated = response.data.authenticated;
          this.$root.authenticated = response.data.authenticated;
          this.user = response.data.user;
          return true;
        } catch (error) {
          // console.error('Error checking authentication:', error);
          this.loggedIn = false;
          this.authenticated = false;
          this.user = null;
          return false;
        }
      },
    },
  };
  </script>
  

  <style scoped>
  .notification-icon {
    font-size: 24px;
    cursor: pointer;
    margin-left: 20px;
    margin-top: 5px;
    color: white;
  }
  </style>
  
