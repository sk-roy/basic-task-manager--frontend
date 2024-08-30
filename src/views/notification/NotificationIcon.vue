<template>
    <div class="notification-icon" @click="goToNotifications">
        <i class="fas fa-bell"></i> <!-- FontAwesome icon -->
        <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
    </div>
</template>

<script>
export default {
    props: {
        unreadCount: {
            type: Number,
            default: 0,
        },
    },
    methods: {
        goToNotifications() {
            this.$router.push({ name: 'notifications' }); // Navigate to the notifications page
        },
    },
};
</script>

<style scoped>
.notification-icon {
    position: relative;
    cursor: pointer;
    font-size: 24px;
    color: #333;
}

.badge {
    position: absolute;
    top: -5px;
    right: -10px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 2px 6px;
    font-size: 12px;
}
</style>
