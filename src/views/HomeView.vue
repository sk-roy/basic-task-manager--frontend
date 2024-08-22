<template>
  <main>
    <div class="container mt-5">
      <div class="card">

        <div class="card-header row-container flex justify-between items-center p-4 bg-gray-100 rounded-lg">
          <div>
            <h4 class="text-lg font-semibold">Tasks</h4>
          </div>
          <form v-if="share.selectedTasks.length">
            <div class="mb-3 mw-100">
              <label for="">Email</label>
              <input type="text" v-model="share.email" class="form-control" required/>
            </div>
            <button type="button" class="btn btn-primary" @click="shareTasks"> Done </button>
          </form>
        </div>

        <div class="card-body">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="px-4 py-2">
                  <input type="checkbox" @change="toggleSelectAll" v-model="selectAll" />
                </th>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody v-if="this.tasks.length > 0">
              <tr v-for="(task, index) in this.tasks" :key="index">
                <td class="px-4 py-2">
                  <input
                    type="checkbox"
                    v-model="share.selectedTasks"
                    :value="task.id"
                  />
                </td>
                <td>{{ task.title }}</td>
                <td>{{ task.description }}</td>
                <td>{{ this.formatDate(task.due_date) }}</td>
                <td>{{ task.status ? "Completed" : "Incompleted" }}</td>
                <td>
                  <RouterLink :to="{path: '/tasks/' + task.id + '/update'}" class="btn btn-primary mx-2"> Update </RouterLink>
                  <RouterLink :to="{path: '/tasks/' + task.id + '/details'}" class="btn btn-success mx-2"> Details </RouterLink>
                  <button type="button" class="btn btn-danger mx-2" @click="deleteTasks(task.id)" >Delete</button>
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
      share: {
        selectedTasks: [],
        email: '',
      },
      selectAll: false,
    };
  },

  mounted() {
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
        });
    },

    deleteTasks(taskId) {
      const token = this.getTokenFromCookie();
      axios
        .delete(`http://127.0.0.1:8000/api/tasks/${taskId}/delete`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          this.tasks = res.data.tasks;
          this.getTasks();
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

    toggleSelectAll() {
      if (this.selectAll) {
        this.share.selectedTasks = this.tasks.map(task => task.id);
      } else {
        this.share.selectedTasks = [];
      }
    },    

    formatDate(value) {
      if (value) {
        return new Date(value).toISOString().slice(0, 10);
      }
    },

    async shareTasks() {
      if (!this.share.email) {
        alert('Please enter registered email');
      } else {
        var token = this.getTokenFromCookie();
        await axios.post("http://127.0.0.1:8000/api/tasks/share", this.share, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            alert(res.data.message);
            this.share.selectedTasks = [];
          });
        }
    },
  },
};
</script>
