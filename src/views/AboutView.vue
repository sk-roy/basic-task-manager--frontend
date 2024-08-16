<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <h2 class="text-2xl font-semibold text-center mb-6">Your Profile</h2>
      <div v-if="user" class="space-y-4">
        <div>
          <span class="font-semibold">Name:</span>
          <span>{{ user.name }}</span>
        </div>
        <div>
          <span class="font-semibold">Email:</span>
          <span>{{ user.email }}</span>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">
        Loading profile...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const user = ref(null);
const errorMessage = ref('');

// Set up Axios to use credentials
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000'; // Your Laravel API URL

// Fetch user profile on page load
const fetchUserProfile = async () => {
  try {
    const response = await axios.get('/api/user');
    user.value = response.data;
  } catch (error) {
    errorMessage.value = 'Failed to load profile. Please try again.';
  }
};

// Fetch profile data when component is mounted
onMounted(fetchUserProfile);
</script>
