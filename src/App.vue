<script>
import { RouterLink, RouterView } from "vue-router";
import apiClient from "./plugins/axios";
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
      notifications: [],
      messages: [],
      user: [],
      loggedIn: false,
      tasks: [],
    };
  },

  created() {
    this.$root.notifications = this.notifications;
  },

  mounted() {
      this.subscribeToTaskChannels();
      this.getUser();
  },

  methods: {    

    goToNotifications() {
      this.$router.push({ name: 'notifications' }); // Navigate to the notifications page
    },
    
    async subscribeToTaskChannels() {
      try {
        const params = new URLSearchParams();
        params.append('sort_key', this.sortKey);
        params.append('sort_order', this.sortOrder);

        const response = await apiClient.get('/tasks');
        this.tasks = response.data.tasks;
        response.data.tasks.forEach(task => {
          window.Echo.channel(`task.${task.id}`)
            .listen('.task.update', (task) => {
              var message = `${task.creator_name} updated the task "${task.title}".`;
              this.addNotification(task, message);
              // this.$store.dispatch('addNotification', task);
            })
            .listen('.task.delete', (task) => {
              var message = `${task.deleted_by_name} deleted the task "${task.title}".`;
              this.addNotification(task, message);
            })
            .listen('.task.addComment', (comment) => {
              var message = `${comment.user_name} added a comment to the task "${comment.task_title}".`;
              this.addNotification(comment, message);
            });
        });
      } catch (error) {
        console.error("Error during getting task:", error);
        alert("Error during getting tasks");
      }
    },

    addNotification(task, message) {
      const notification = {
          id: task.id,
          message: message,
          timestamp: new Date().toLocaleString(),
      };
      if (this.user['id'] != task.creator_id) {
        // alert(message);
        this.notifications.push(notification); // Add the notification to the array
      }
    },

    async logout() {
      try {
        const response = await apiClient.post("/logout");
        this.$router.push("/login");
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
  },
};
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid" v-if="loggedIn">
          <RouterLink class="navbar-brand" to="/">Task Manager</RouterLink>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <RouterLink class="nav-link active" aria-current="page" to="/"
                  >Home</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink
                  class="nav-link active"
                  aria-current="page"
                  to="/newtask"
                  >New Task</RouterLink
                >
              </li>
            </ul>

            
            <form class="d-flex" role="search">
              <RouterLink
                class="nav-link active"
                aria-current="page"
                to="/notification"
                >
                  <font-awesome-icon icon="fa-regular fa-bell" class="notification-icon" />
                </RouterLink
              >
              <a class="text-white text-decoration-none mx-3" href="/profile"> {{ user.name }} </a>
              <RouterLink
                class="text-white text-decoration-none"
                aria-current="page"
                to="/login"
                @click="logout"
                >Logout</RouterLink>
            </form>
          </div>
        </div>
      </nav>
    </div>
  </header>
  <RouterView />
</template>


<style scoped>
.notification-icon {
  font-size: 24px;
  cursor: pointer;
  margin-left: 20px;
  margin-top: 5px;
  color: white;
}
</style>
