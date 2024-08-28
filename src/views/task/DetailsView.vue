<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h4>{{ model.task.title }}</h4>
      </div>
      <div class="card-body">
        <div class="flex flex-row">
          <div class="flex">
            <div class="mb-6">
              <h5 class="text-lg font-semibold mb-2">
                Description: {{ model.task.description }}
              </h5>
            </div>

            <div class="mb-6">
              <h5 class="text-lg font-semibold mb-2">
                Due Date: {{ this.formatDate(model.task.due_date) }}
              </h5>
            </div>

            <div class="mb-6">
              <h5 class="text-lg font-semibold mb-2">
                Status:
                {{ model.task.status == 1 ? "Completed" : "Incompleted" }}
              </h5>
            </div>

            <div class="mb-6">
              <h5 class="text-lg font-semibold mb-2">Labels:</h5>
              <div class="flex gap-2">
                <span
                  v-for="label in model.task.labels"
                  :key="label.id"
                  class="bg-blue-200 text-blue-800 py-1 px-3 rounded-full text-sm font-semibold"
                >
                  {{ label.name }}
                </span>
              </div>
            </div>

            <div class="mb-6">
              <h5>Files</h5>
              <ul>
                <div v-for="file in model.files" :key="file.id">
                  <li>{{ file.filename }}</li>
                  <button
                    type="button"
                    class="btn btn-primary mx-2 h-10"
                    @click="downloadFile(file.filename, file.id)"
                  >
                    Download
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger mx-2"
                    @click="deleteFile(file.id)"
                  >
                    Delete
                  </button>
                </div>
              </ul>
            </div>
          </div>
          <div class="flex">
            <input id="fileUpload" @change="handleFileUpload" type="file" />
            <button @click="uploadFiles()">Upload selected File</button>
          </div>
        </div>
      </div>
    </div>

    <div>
      <h5 class="text-lg font-semibold mb-4">Comments:</h5>
      <ul>
        <li
          v-for="comment in model.task.comments"
          :key="comment.id"
          class="mb-4 p-4 border rounded-lg"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold">{{ comment.user.name }}</span>
            <span class="text-gray-500 text-sm">{{
              comment.created_at | formatDate
            }}</span>
          </div>
          <p>{{ comment.content }}</p>
        </li>
        <div class="card-body">
          <div class="mb-3">
            <textarea
              v-model="model.message"
              class="form-control"
              style="width: 400px"
            ></textarea>
          </div>
          <div class="mb-3">
            <button type="button" @click="addComment" class="btn btn-primary">
              Add comment
            </button>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
import apiClient from "../../plugins/axios";

export default {
  name: "taskDetails",
  data() {
    return {
      model: {
        task: {
          title: "",
          description: "",
          due_date: "",
          status: "",
          comments: [],
          labels: [],
          file: null,
        },
        files: [],
        message: "",
      },
    };
  },

  mounted() {
    this.getTaskData(this.$route.params.id);
    this.getFileList();
  },

  methods: {
    async addComment() {
      try {
        const res = await apiClient.post(
          "/comment/create",
          this.model.message,
          {
            params: {
              task_id: this.$route.params.id,
            },
          }
        );
        console.log(res);
        // this.model.task = res.data;
      } catch (error) {
        console.error(`Task ${taskID} loading failed:`, error);
        alert("Task load Failed");
      }
    },

    async getTaskData(taskId) {
      try {
        const res = await apiClient.get(`/tasks/${taskId}`);
        this.model.task = res.data;
      } catch (error) {
        console.error(`Task ${taskID} loading failed:`, error);
        alert("Task load Failed");
      }
    },

    async getFileList() {
      try {
        const response = await apiClient.get("/files", {
          params: {
            task_id: this.$route.params.id,
          },
        });
        this.model.files = response.data.files;
      } catch (error) {
        console.error("File loading failed:", error);
        alert("Failed to load files.");
      }
    },

    async uploadFiles() {
      try {
        const formData = new FormData();
        formData.append("file", this.model.task.file);
        formData.append("task_id", this.$route.params.id);

        const response = await apiClient.post("/files", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await this.getFileList();
        alert(response.data.message);
      } catch (error) {
        console.error("File upload failed:", error);
        alert("Failed to upload the file.");
      }
    },

    async downloadFile(name, id) {
      try {
        const response = await apiClient.get("/files/download", {
          params: {
            file_id: id,
          },
          responseType: "blob",
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${name}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("File upload failed:", error);
        alert("Failed to upload the file.");
      }
    },

    async deleteFile(id) {
      if (confirm("Are you sure?")) {
        try {
          const response = await apiClient.delete(`/files/${id}`);
          await this.getFileList();
          alert(response.data.message);
        } catch (error) {
          console.error("Failed to delete file:", error);
          alert("Failed to delete the file.");
        }
      }
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      this.model.task.file = file;
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

    formatDate(value) {
      if (value) {
        return new Date(value).toISOString().slice(0, 10);
      }
    },

    statusClass(status) {
      switch (status) {
        case "0":
          return "bg-yellow-200 text-yellow-800";
        case "1":
          return "bg-green-200 text-green-800";
        default:
          return "bg-gray-200 text-gray-800";
      }
    },
  },
};
</script>
