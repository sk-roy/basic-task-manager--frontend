<template>
  <div>
    <NavBar/>
    <div class="container" mt-5>
      <div class="card">
        <div class="card-header">
          <h4>Edit Tasks</h4>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label for="">Title</label>
            <input type="text" v-model="model.task.title" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="">Description</label>
            <textarea
              v-model="model.task.description"
              class="form-control"
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="">Due Date</label>
            <input
              type="date"
              v-model="model.task.due_date"
              value="{{ old('due_date', date('Y-m-d')) }}"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label for="">Status</label>
            <!-- <input type="text" class="form-control"> -->
            <select v-model="model.task.status" class="form-control">
              <option value="0">Incomplete</option>
              <option value="1">Completed</option>
            </select>
          </div>
          <div class="mb-3">
            <button type="button" @click="updateTask" class="btn btn-primary">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import apiClient from "@/plugins/axios";

export default {
  name: "taskUpdate",
  data() {
    return {
      model: {
        task: {
          title: "",
          description: "",
          due_date: "",
          status: "",
        },
      },
    };
  },

  components: {
    NavBar,
  },

  mounted() {
    this.getTaskData(this.$route.params.id);
  },

  methods: {
    async getTaskData(taskId) {
      try {
        const response = await apiClient.get(`/tasks/${taskId}`);
        this.model.task = response.data.task;
        this.model.task.due_date = this.formatDate(response.data.task.due_date);
      } catch (error) {
        console.error("Failed to load task data:", error);
        alert("Failed to load task data.");
      }
    },

    formatDate(value) {
      if (value) {
        return new Date(value).toISOString().slice(0, 10);
      }
    },

    async updateTask() {
      try {
        const response = await apiClient.patch(
          `/tasks/${this.$route.params.id}/update`,
          this.model.task
        );
        this.$router.push("/");
      } catch (error) {
        console.error("Failed to update task:", error);
        alert("Failed to update task.");
      }
    },
  },
};
</script>
