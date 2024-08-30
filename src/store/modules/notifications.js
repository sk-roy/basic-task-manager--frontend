// store/modules/notifications.js
export default {
    state: {
        notifications: [],
    },
    mutations: {
        ADD_NOTIFICATION(state, notification) {
            state.notifications.push(notification);
        },
    },
    actions: {
        addNotification({ commit }, event) {
            const notification = {
                id: event.task.id,
                message: `Task "${event.task.title}" was updated.`,
                timestamp: new Date().toLocaleString(),
            };
            commit('ADD_NOTIFICATION', notification);
        },
    },
    getters: {
        allNotifications: state => state.notifications,
        unreadNotificationsCount: state => state.notifications.length, // Example to calculate unread count
    },
};
