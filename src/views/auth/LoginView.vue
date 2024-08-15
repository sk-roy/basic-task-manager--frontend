<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h4>Log In</h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="">Email</label>
          <input type="text" v-model="email" class="form-control" />
        </div>
        <div class="mb-3">
          <label for="">Password</label>
          <input type="password" v-model="password" class="form-control" />
        </div>
        <div class="mb-3">
          <button type="button" @click="login()" class="btn btn-primary">
            Login
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/login", {
          email: this.email,
          password: this.password,
        });
        console.log(response);

        // Store the token in a cookie
        const token = response.data.token;
        document.cookie = `auth_token=${token}; path=/; max-age=${
          24 * 60 * 60
        }`; // 1 day

        // Redirect to the profile page
        this.$router.push("/");
      } catch (error) {
        console.error("Login failed", error);
        alert("Login failed. Please check your credentials.");
      }
    },
  },
};
</script>
