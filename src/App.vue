<script>
import { RouterLink, RouterView } from "vue-router";
import apiClient from "./plugins/axios";
import Pusher from "pusher-js";
// import Echo from 'laravel-echo';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBell } from '@fortawesome/free-regular-svg-icons'; 
import NavBar from "./components/NavBar.vue";

library.add(faBell); // Add the icon to the library

export default {
  name: "app",
  components: {
    FontAwesomeIcon,
    NavBar,
  },

  // mounted() {
  //   this.listenNotification();
  // },

  // methods: {
  //   listenNotification() {
  //     window.Echo.private('App.Models.User.' + '1')
  //     .notification((notification) => {
  //         console.log(notification.type);
  //     });
  //   }
  // }

};

</script>



<template>
  <!-- <header v-if="true">
    <div class="wrapper">
      <NavBar />
    </div>
  </header> -->

  <RouterView />
</template>


