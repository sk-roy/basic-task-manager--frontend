<template>
    <div>
        <NavBar/>
    </div>
    <div class="notifications">
        <h1>Notifications</h1>
        <ul>
            <li v-for="notification in $root.notifications" :key="notification.id">
                <strong>{{ notification.message }}  </strong> {{ notification.timestamp }}
            </li>
        </ul>
    </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
  props: {
    notifications: {
      type: Array,
      default: () => [],
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
