<template>
  <div class="min-h-screen bg-gray-50 py-6">
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900">My Tasks</h1>
          <button @click="logout" class="btn btn-secondary">Logout</button>
        </div>

        <!-- Add Todo Form -->
        <div class="card mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Add New Task</h2>
          <form @submit.prevent="addTodo" class="flex flex-col space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input 
                type="text" 
                id="title" 
                v-model="newTodo.title" 
                class="input mt-1 block w-full" 
                placeholder="What needs to be done?"
                required
              >
            </div>
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea 
                id="description" 
                v-model="newTodo.description" 
                class="input mt-1 block w-full" 
                rows="3"
                placeholder="Add details about this task"
              ></textarea>
            </div>
            <div class="flex space-x-4">
              <div class="w-1/2">
                <label for="dueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
                <input 
                  type="date" 
                  id="dueDate" 
                  v-model="newTodo.dueDate" 
                  class="input mt-1 block w-full"
                >
              </div>
              <div class="w-1/2">
                <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                <select 
                  id="category" 
                  v-model="newTodo.category" 
                  class="input mt-1 block w-full"
                >
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="shopping">Shopping</option>
                  <option value="health">Health</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div class="flex justify-between">
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="syncWithCalendar" 
                  v-model="newTodo.syncWithCalendar" 
                  class="h-4 w-4 text-blue-600 border-gray-300 rounded"
                >
                <label for="syncWithCalendar" class="ml-2 block text-sm text-gray-700">
                  Sync with Google Calendar
                </label>
              </div>
              <button type="submit" class="btn btn-primary">Add Task</button>
            </div>
          </form>
        </div>

        <!-- Filters -->
        <div class="flex space-x-4 mb-6">
          <button 
            @click="setFilter('all')" 
            :class="['btn', filter === 'all' ? 'btn-primary' : 'btn-secondary']"
          >
            All
          </button>
          <button 
            @click="setFilter('active')" 
            :class="['btn', filter === 'active' ? 'btn-primary' : 'btn-secondary']"
          >
            Active
          </button>
          <button 
            @click="setFilter('completed')" 
            :class="['btn', filter === 'completed' ? 'btn-primary' : 'btn-secondary']"
          >
            Completed
          </button>
        </div>

        <!-- Todo List -->
        <div class="space-y-4 mb-6">
          <template v-if="filteredTodos.length > 0">
            <div 
              v-for="todo in filteredTodos" 
              :key="todo.id" 
              class="card flex items-start space-x-4"
            >
              <input 
                type="checkbox" 
                :id="'todo-' + todo.id" 
                v-model="todo.completed" 
                @change="toggleTodoStatus(todo.id)" 
                class="h-6 w-6 text-blue-600 border-gray-300 rounded mt-1"
              >
              <div class="flex-grow">
                <div class="flex justify-between items-start">
                  <div>
                    <label 
                      :for="'todo-' + todo.id" 
                      class="text-lg font-medium text-gray-900"
                      :class="{ 'line-through text-gray-400': todo.completed }"
                    >
                      {{ todo.title }}
                    </label>
                    <div 
                      v-if="todo.description"
                      class="mt-1 text-gray-600"
                      :class="{ 'text-gray-400': todo.completed }"
                    >
                      {{ todo.description }}
                    </div>
                  </div>
                  <button 
                    @click="deleteTodo(todo.id)" 
                    class="text-red-600 hover:text-red-800"
                  >
                    <span class="sr-only">Delete</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                  <div v-if="todo.dueDate" class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {{ formatDate(todo.dueDate) }}
                  </div>
                  <div v-if="todo.category" class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {{ capitalize(todo.category) }}
                  </div>
                  <div v-if="todo.syncWithCalendar" class="flex items-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Synced with Calendar
                  </div>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="card text-center py-8">
            <p class="text-gray-500 text-lg">No tasks found</p>
            <p class="text-gray-500">Add a new task to get started</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTodoStore } from '../stores/todoStore';

const router = useRouter();
const todoStore = useTodoStore();

const newTodo = ref({
  title: '',
  description: '',
  dueDate: '',
  category: 'other',
  syncWithCalendar: false
});

// Load todos from store on component mount
onMounted(() => {
  todoStore.loadTodos();
});

// Get filtered todos and filter from the store
const filteredTodos = computed(() => todoStore.filteredTodos);
const filter = computed(() => todoStore.filter);

// Set the current filter
const setFilter = (newFilter) => {
  todoStore.setFilter(newFilter);
};

// Add a new todo
const addTodo = () => {
  todoStore.addTodo({
    title: newTodo.value.title,
    description: newTodo.value.description,
    dueDate: newTodo.value.dueDate,
    category: newTodo.value.category,
    syncWithCalendar: newTodo.value.syncWithCalendar
  });
  
  // Reset the form
  newTodo.value = {
    title: '',
    description: '',
    dueDate: '',
    category: 'other',
    syncWithCalendar: false
  };
};

// Toggle todo completed status
const toggleTodoStatus = (id) => {
  todoStore.toggleTodo(id);
};

// Delete a todo
const deleteTodo = (id) => {
  todoStore.deleteTodo(id);
};

// Utility function to format date
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Utility function to capitalize first letter
const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Logout
const logout = () => {
  localStorage.removeItem('token');
  router.push('/login');
};
</script> 