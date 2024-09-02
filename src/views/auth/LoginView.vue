<template>
  <div class="container mt-5 d-flex justify-content-center ">
    <div class="card custom-width">
      <div class="card-header d-flex justify-content-center ">
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
        <div class="d-flex justify-content-center mb-3 gap-3">
          <button type="button" @click="login()" class="btn btn-primary">
              Login
          </button>
          <button type="button" @click="registration()" class="btn btn-primary">
              Registration
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.custom-width {
    width: 600px;
}
</style>

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

    registration() {
      this.$router.push("/register");
    }
  },
};
</script>
