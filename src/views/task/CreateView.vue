<template>
  <div class="container mt-5">
    <div class="card">
      <div class="card-header">
        <h4>Add Tasks</h4>
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
          <button type="button" @click="saveTask" class="btn btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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

  methods: {
    saveTask() {
      var token = this.getTokenFromCookie();
      console.log(token);
      console.log(this.model.task.title);
      axios
        .post("http://127.0.0.1:8000/api/tasks/create", this.model.task, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          alert(res.data.message);
          this.model.task = {
            title: '',
            description: '',
            due_date: '',
            status: '',
          }
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
