<template>


<div class="container">
      <div class="card">
        <div class="card-header">
          <h4>{{ user.name }}</h4>
        </div>
        <div class="card-body">

          <div class="mb-6">
            <h5 class="text-lg font-semibold mb-2">{{ user.email }}</h5>
          </div>

          <div class="mb-6">
            <h5 class="text-lg font-semibold mb-2">{{ user.admin == 1 ? 'Admin' : 'Not Admin' }}</h5>
          </div>
        </div>
      </div>
</div>
</template>

<script>
import axios from "axios";

export default {
  name: "tasks",
  data() {
    return {
      user: [],
    };
  },

  mounted() {
    this.getUser();
  },

  methods: {
    getUser() {
      const token = this.getTokenFromCookie();
      axios
        .get("http://127.0.0.1:8000/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
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