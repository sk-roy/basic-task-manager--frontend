<template>
  <div class="container mt-5">
    <div class="card" v-if="user.name">
      <div class="card-header">
        <h4>{{ user.name }}</h4>
      </div>
      <div class="card-body">
        <div>
          <h5 class="text-lg font-semibold mb-2">{{ user.email }}</h5>
        </div>

        <div>
          <h5 class="text-lg font-semibold mb-2">
            {{ user.admin == 1 ? "Admin" : "Not Admin" }}
          </h5>
        </div>
      </div>
    </div>

    <div class="card" v-if="!user.name">
      <h5 class="text-lg font-semibold mb-2">Loading...</h5>
    </div>
  </div>
</template>

<script>
import apiClient from "@/plugins/axios";

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
    async getUser() {
      try {
        const response = await apiClient.get("/user");
        this.user = response.data;
      } catch (error) {
        console.error("Error to get user data:", error);
        alert("Error to get user data");
      }
    },
  },
};
</script>
