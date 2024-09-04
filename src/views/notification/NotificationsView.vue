<template>
    <div>
        <NavBar/>
    </div>
    <div class="notifications">
        <h1>Notifications</h1>
        <ul>
            <li v-for="notification in notifications" :key="notification.id">
                <strong>{{ notification.data.message }}  </strong> {{ formatDateTime(notification.created_at) }}
                {{ notification.unread ? 'New' : '' }}
            </li>
        </ul>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import apiClient from '@/plugins/axios';

export default {
  data() {
    return {
        notifications: [],
    }
  },

  mounted() {
    this.allNotifications();
  },

  methods: {
    async allNotifications() {
        try {
            const response = await apiClient.get('/notification/unread');
            console.log(response);
            this.notifications = response.data.notifications;
        } catch (error) {
            console.error('Failed on notifications loading: ', error);
        }
    },
    

    formatDateTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
    },
  },

  components: {
    NavBar,
  }
};
</script>

<style scoped>
.notifications {
    padding: 20px;
}

.notifications h1 {
    margin-bottom: 20px;
}

.notifications ul {
    list-style-type: none;
    padding: 0;
}

.notifications li {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}
</style>
