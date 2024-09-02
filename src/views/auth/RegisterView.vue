<template>
  <div class="container mt-5 d-flex justify-content-center ">
    <div class="card custom-width">
      <div class="card-header d-flex justify-content-center ">
        <h4> Registration </h4>
      </div>
      <div class="card-body">
        <div class="mb-3">
          <label for="">Name</label>
          <input type="text" v-model="name" class="form-control" required/>
        </div>
        <div class="mb-3">
          <label for="">Email</label>
          <input type="text" v-model="email" class="form-control" required/>
        </div>
        <div class="mb-3">
          <label for="">Password</label>
          <input type="password" v-model="password" class="form-control" required/>
        </div>
        <div class="mb-3">
          <label for="">Confirm Password</label>
          <input type="password" v-model="confirmPassword" class="form-control" required/>
        </div>
        <div class="d-flex justify-content-center mb-3 gap-3">
          <button type="button" @click="register()" class="btn btn-primary">
            Register
          </button>
          <button type="button" @click="login()" class="btn btn-primary">
              Go to Login Page
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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  },
  methods: {
    async register() {
      if (this.password == this.confirmPassword) {
        try {
          const response = await axios.post("http://127.0.0.1:8000/api/register", {
            name: this.name,
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
          console.error("Registration failed", error);
          alert("Registration failed. Please check your credentials.");
        }
      } else {
        alert("Password doesn't match");
      }
    },

    login() {
      this.$router.push("/login");
    }
  },
};
</script>
