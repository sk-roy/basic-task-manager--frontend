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
                <div v-for="file in model.task.files" :key="file.id">
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
          class="mb-2"
        >
          <div class="card">
            <div class="card-header flex justify-between items-center mb-2">
              <h5 class="font-semibold">{{ comment.name }}</h5>
              <span class="text-gray-500 text-sm">{{ formatDateTime(comment.created_at) }}</span>
            </div>
            <div class="card-body">
              <p>{{ comment.message }}</p>
              <button
                type="button"
                class="btn btn-primary mx-2 p-1"
                @click="editComment(comment)"
              > Edit </button>
              <button
                type="button"
                class="btn btn-danger mx-2 p-1"
                @click="deleteComment(comment.id)"
              > Delete </button>
            </div>
        </div>
        </li>
      </ul>
        <div class="card-body">
          <div class="mb-3">
            <textarea
              v-model="model.newComment.message"
              class="form-control"
              style="width: 400px"
            ></textarea>
          </div>
          <div>
            <div class="mb-3" v-if="model.const.update">
              <button  type="button" @click="updateComment()" class="btn btn-primary mx-2">
                Update
              </button>
              <button type="button" @click="cancelUpdate" class="btn btn-primary">
                Cancel
              </button>
            </div>
            <div class="mb-3" v-if="!model.const.update">
              <button type="button" @click="addComment" class="btn btn-primary">
                Add comment
              </button>
            </div>
          </div>
        </div>
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
        const: {
          update: false,
          updateCommentId: "",
          file: null,
        },
        task: {
          title: "",
          description: "",
          due_date: "",
          status: "",
          comments: [],
          labels: [],
          files: [],
        },
        newComment: {
          message: "",
          task_id: "",
        }
      },
    };
  },

  mounted() {
    this.getTaskData();
    // this.getFileList();
  },

  methods: {
    async addComment() {
      try {
        this.model.newComment.task_id = this.$route.params.id;
        const res = await apiClient.post(
          "/comments/create",
          this.model.newComment,
        );
        await this.getTaskData();
        this.cancelUpdate();
      } catch (error) {
        console.error(`Comment add failed to task ${this.model.newComment.task_id}:`, error);
        alert("Comment adding failed");
      }
    },

    async editComment(comment) {
      this.model.newComment = {
        'message': comment.message,
        'task_id': comment.task_id,
      }
      this.model.const.updateCommentId = comment.id;
      this.model.const.update = true;
    },

    async updateComment(comment) {
    try {
      const res = await apiClient.patch(
        `/comments/${this.model.const.updateCommentId}/update`,
        this.model.newComment,
      );      
      await this.getTaskData();
      this.cancelUpdate();
      } catch (error) {
        console.error(`Comment updating failed on task ${this.model.newComment.task_id}:`, error);
        alert("Comment updating failed");
      }
    },

    cancelUpdate() {
      this.model.newComment.message = "";
      this.model.const.update = false;
    },

    async deleteComment(commentId) {
      try {
        this.model.newComment.task_id = this.$route.params.id;
        const res = await apiClient.delete(`/comments/${commentId}/delete`);
        await this.getTaskData();
      } catch (error) {
        console.error(`Comment deleting to task ${this.model.newComment.task_id}:`, error);
        alert("Comment deleting failed");
      }
    },

    async getTaskData() {
      try {
        const res = await apiClient.get(`/tasks/${this.$route.params.id}`);
        console.log(res);
        this.model.task = res.data.task;
      } catch (error) {
        console.error(`Task ${taskID} loading failed:`, error);
        alert("Task load Failed");
      }
    },

    async uploadFiles() {
      try {
        const formData = new FormData();
        formData.append("file", this.model.const.file);
        formData.append("task_id", this.$route.params.id);

        const response = await apiClient.post("/files", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await this.getTaskData();
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
          await this.getTaskData();
          alert(response.data.message);
        } catch (error) {
          console.error("Failed to delete file:", error);
          alert("Failed to delete the file.");
        }
      }
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      this.model.const.file = file;
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

    formatDateTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleString();
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
