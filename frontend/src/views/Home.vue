<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Smart Todo App
        </h1>
        <p class="mt-5 max-w-xl mx-auto text-xl text-gray-500">
          Organize your tasks and synchronize with Google Calendar
        </p>
        <div class="mt-8 flex justify-center gap-4">
          <router-link to="/login" class="btn btn-primary">Get Started</router-link>
          <router-link to="/about" class="btn btn-secondary">Learn More</router-link>
        </div>
      </div>
      
      <div class="mt-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="card">
            <div class="text-2xl font-bold text-blue-600 mb-4">Easy Organization</div>
            <p class="text-gray-600">Create, categorize, and prioritize your tasks effortlessly</p>
          </div>
          <div class="card">
            <div class="text-2xl font-bold text-blue-600 mb-4">Google Integration</div>
            <p class="text-gray-600">Sync with your Google Calendar and access from anywhere</p>
          </div>
          <div class="card">
            <div class="text-2xl font-bold text-blue-600 mb-4">Smart Reminders</div>
            <p class="text-gray-600">Get notifications for upcoming tasks and deadlines</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Home view
</script> 