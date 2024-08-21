<template>

  
<div class="container">
      <div class="card">
        <div class="card-header">
          <h4>{{ model.task.title }}</h4>
        </div>
        <div class="card-body">

          <div class="mb-6">
            <h5 class="text-lg font-semibold mb-2">Description: {{ model.task.description }}</h5>
          </div>

          <div class="mb-6">
            <h5 class="text-lg font-semibold mb-2">Due Date: {{ this.formatDate(model.task.due_date)}}</h5>
          </div>

          <div class="mb-6">
            <h5 class="text-lg font-semibold mb-2">Status: {{ model.task.status == 1 ? 'Completed' : 'Incompleted' }}</h5>
          </div>

          <div class="mb-6">
            <h5 class="text-lg font-semibold mb-2">Labels: </h5>
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
            <span class="text-gray-500 text-sm">{{ comment.created_at | formatDate }}</span>
          </div>
          <p>{{ comment.content }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import axios from 'axios';


  export default {
    name: 'taskUpdate',
    data() {
      return {
        model: {
          task: {
            title: '',
            description: '',
            due_date: '',
            status: '',
            comments: [],
            labels: [],
            // comments: ['first comment', 'second comment'],
            // labels: ['secondLabel', 'firstLabel'],
          }
        }
      }
    },

    mounted(){
      this.getTaskData(this.$route.params.id);
    },

    methods: {

      getTaskData(taskId){
        const token = this.getTokenFromCookie();
        axios.get(`http://127.0.0.1:8000/api/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(res => {
          this.model.task = res.data;
        })

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
    }
  }

</script>