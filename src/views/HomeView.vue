<template>
  <main>
    <div class="container">
      <div class="card">
        <div class="card-header">
          <h4>Tasks</h4>
        </div>
        <div class="card-body">
          <table class="table table-bordered">
            <thead>
              <tr>
                <td>Title</td>
                <td>Description</td>
                <td>Due Date</td>
                <td>Status</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody v-if="this.tasks.length > 0">
              <tr v-for="(task, index) in this.tasks" :key="index">
                <td>{{ task.title }}</td>
                <td>{{ task.description }}</td>
                <td>{{ task.due_date }}</td>
                <td>{{ task.status ? "Completed" : "Incompleted" }}</td>
                <td>
                  <RouterLink :to="{path: '/tasks/' + task.id + '/update'}" class="btn btn-success"> Update </RouterLink>
                  <button type="button" class="btn btn-danger">Delete</button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="4">Loading...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";

export default {
  name: "tasks",
  data() {
    return {
      tasks: [],
    };
  },

  mounted() {
    // console.log("I am here");
    this.getTasks();
  },
  methods: {
    getTasks() {
      const token = this.getTokenFromCookie();
      axios
        .get("http://127.0.0.1:8000/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          this.tasks = res.data.tasks;
          console.log(this.tasks);
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
