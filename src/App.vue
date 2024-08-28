<script>
import { RouterLink, RouterView } from "vue-router";
import apiClient from "./plugins/axios";

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
