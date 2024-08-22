<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid" v-if="!loggedIn">
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <RouterLink
                  class="nav-link active"
                  aria-current="page"
                  to="/login"
                  >Log In</RouterLink
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="container-fluid" v-if="loggedIn">
          <RouterLink class="navbar-brand" to="/">Task Manager</RouterLink>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item" >
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
              <li class="nav-item">
                <RouterLink
                  class="nav-link active"
                  aria-current="page"
                  to="/profile"
                  >{{ user.name }}</RouterLink
                >
              </li>
              <li class="nav-item">
                <RouterLink
                  class="nav-link active"
                  aria-current="page"
                  to="/login"
                  @click="logout"
                  >Log Out</RouterLink
                >
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script>
import axios from "axios";

export default {
  name: "app",
  data() {
    return {
      user: [],
      loggedIn: false,
    };
  },

  mounted() {
    this.getUser();
  },

  methods: {
    async logout() {
      try {
        const token = this.getTokenFromCookie();
        document.cookie = "auth_token=; path=/; max-age=0";
        await axios.post("http://127.0.0.1:8000/api/logout", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            // this.$router.push("/login");
            console.log(res.data.status);
          });
      } catch (error) {
        console.error('Error during logout:', error);
      }
      this.$router.push("/login");
    },
    
    async getUser() {
      const token = this.getTokenFromCookie();
      await axios.get("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
        this.loggedIn = true;
        this.user = res.data;
      });
    },

    getTokenFromCookie() {
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
    },
  },
};
</script>
