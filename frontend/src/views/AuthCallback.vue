<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="card text-center p-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-600">Processing your login...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // Get token and user from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const userStr = urlParams.get('user');
  
  if (token && userStr) {
    try {
      // Save token to localStorage
      localStorage.setItem('token', token);
      
      // Parse and save user data
      const user = JSON.parse(decodeURIComponent(userStr));
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect to todos page
      router.push('/todos');
    } catch (error) {
      console.error('Error processing auth callback:', error);
      router.push('/login');
    }
  } else {
    // If no token or user, redirect to login
    router.push('/login');
  }
});
</script> 