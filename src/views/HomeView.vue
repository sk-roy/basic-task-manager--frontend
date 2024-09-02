<template>
  <main>
    <div>
      <NavBar />
    </div>
    <div class="container mt-5">
      <div class="card">
        <div
          class="card-header row-container flex justify-between items-center p-4 bg-gray-100 rounded-lg"
        >
          <div>
            <h4 class="text-lg font-semibold">Tasks</h4>
          </div>
          <form v-if="share.selectedTasks.length">
            <div class="mb-3 mw-100">
              <label for="">Email</label>
              <input
                type="text"
                v-model="share.email"
                class="form-control"
                required
              />
            </div>
            <button type="button" class="btn btn-primary" @click="shareTasks">
              Share
            </button>
          </form>
        </div>

        <div class="card-body">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th class="px-4 py-2">
                  <input
                    type="checkbox"
                    @change="toggleSelectAll"
                    v-model="selectAll"
                  />
                </th>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Status</th>
                <th @click="sortBy('labels')">
                  Labels
                  <span v-if="sortKey === 'labels'">
                    {{ sortOrder === 'asc' ? '▲' : '▼' }}
                  </span>
                </th>
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
                  <div v-for="label in task.labels" :key="label.id">
                    {{ label.name }}
                  </div>
                </td>
                <td>
                  <RouterLink
                    :to="{ path: '/tasks/' + task.id + '/update' }"
                    class="btn btn-primary mx-2"
                  >
                    Update
                  </RouterLink>
                  <RouterLink
                    :to="{ path: '/tasks/' + task.id + '/details' }"
                    class="btn btn-success mx-2"
                  >
                    Details
                  </RouterLink>
                  <button
                    type="button"
                    class="btn btn-danger mx-2"
                    @click="deleteTasks(task.id)"
                  >
                    Delete
                  </button>
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
import apiClient from "@/plugins/axios";
import NavBar from "@/components/NavBar.vue";

export default {
  name: "tasks",
  data() {
    return {
      tasks: [],
      sortKey: '',
      sortOrder: 'asc', //('asc' or 'desc')
      share: {
        selectedTasks: [],
        email: "",
      },
      selectAll: false,
    };
  },

  components: {
    NavBar
  },

  mounted() {
    this.getTasks();
  },
  methods: {
    async getTasks() {
      try {
        const params = new URLSearchParams();
        params.append('sort_key', this.sortKey);
        params.append('sort_order', this.sortOrder);

        const response = await apiClient.get(`/tasks?${params.toString()}`);
        this.tasks = response.data.tasks;
      } catch (error) {
        console.error("Error during getting task:", error);
        alert("Error during getting tasks");
      }
    },

    async sortBy(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortOrder = 'asc';
      }
      this.sortKey = key;
      await this.getTasks();
    },

    async deleteTasks(taskId) {
      try {
        const response = await apiClient.delete(`/tasks/${taskId}/delete`);
        this.getTasks();
      } catch (error) {
        console.error("Error during deleting task:", error);
        alert("Error during deleting task");
      }
    },

    toggleSelectAll() {
      if (this.selectAll) {
        this.share.selectedTasks = this.tasks.map((task) => task.id);
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
        alert("Please enter registered email");
      } else {
        try {
          const response = await apiClient.postForm("/tasks/share", this.share);
          this.toggleSelectAll();
          this.share.selectedTasks = [];
        } catch (error) {
          console.error("Error during sharing task:", error);
          alert("Error during sharing task");
        }
      }
    },
  },
};
</script>
