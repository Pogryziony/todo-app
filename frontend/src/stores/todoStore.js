import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { todoAPI } from '../services/api';

export const useTodoStore = defineStore('todos', () => {
  const todos = ref([]);
  const filter = ref('all');
  const isLoading = ref(false);
  const error = ref(null);

  // Load todos from API
  const loadTodos = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      // In dev mode, check if we have a token for API calls
      if (import.meta.env.DEV && !localStorage.getItem('token')) {
        // In development, load from localStorage if available
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
          todos.value = JSON.parse(savedTodos);
        }
      } else {
        // In production mode, always use the API
        const response = await todoAPI.getAllTodos();
        todos.value = response;
      }
    } catch (err) {
      console.error('Error loading todos:', err);
      error.value = 'Failed to load todos. Please try again.';
      
      // Fallback to localStorage in case of API error
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        todos.value = JSON.parse(savedTodos);
      }
    } finally {
      isLoading.value = false;
    }
  };

  // Save todos to localStorage (for dev mode)
  const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos.value));
  };

  // Get filtered todos
  const filteredTodos = computed(() => {
    if (filter.value === 'all') {
      return todos.value;
    } else if (filter.value === 'active') {
      return todos.value.filter(todo => !todo.completed);
    } else if (filter.value === 'completed') {
      return todos.value.filter(todo => todo.completed);
    }
    return todos.value;
  });

  // Add a new todo
  const addTodo = async (todo) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      if (import.meta.env.DEV && !localStorage.getItem('token')) {
        // In dev mode without token, use localStorage
        const newTodo = {
          ...todo,
          id: Date.now(),
          completed: false,
          createdAt: new Date().toISOString()
        };
        todos.value.push(newTodo);
        saveTodos();
      } else {
        // Use API
        const newTodo = await todoAPI.createTodo(todo);
        todos.value.push(newTodo);
      }
    } catch (err) {
      console.error('Error adding todo:', err);
      error.value = 'Failed to add todo. Please try again.';
    } finally {
      isLoading.value = false;
    }
  };

  // Toggle todo completed status
  const toggleTodo = async (id) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      const todo = todos.value.find(t => t.id === id);
      if (!todo) return;
      
      if (import.meta.env.DEV && !localStorage.getItem('token')) {
        // In dev mode without token, use localStorage
        todo.completed = !todo.completed;
        saveTodos();
      } else {
        // Use API
        await todoAPI.updateTodo(id, { completed: !todo.completed });
        todo.completed = !todo.completed;
      }
    } catch (err) {
      console.error('Error toggling todo:', err);
      error.value = 'Failed to update todo status. Please try again.';
    } finally {
      isLoading.value = false;
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      if (import.meta.env.DEV && !localStorage.getItem('token')) {
        // In dev mode without token, use localStorage
        todos.value = todos.value.filter(todo => todo.id !== id);
        saveTodos();
      } else {
        // Use API
        await todoAPI.deleteTodo(id);
        todos.value = todos.value.filter(todo => todo.id !== id);
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
      error.value = 'Failed to delete todo. Please try again.';
    } finally {
      isLoading.value = false;
    }
  };

  // Update a todo
  const updateTodo = async (id, updates) => {
    isLoading.value = true;
    error.value = null;
    
    try {
      if (import.meta.env.DEV && !localStorage.getItem('token')) {
        // In dev mode without token, use localStorage
        const index = todos.value.findIndex(t => t.id === id);
        if (index !== -1) {
          todos.value[index] = { ...todos.value[index], ...updates };
          saveTodos();
        }
      } else {
        // Use API
        const updatedTodo = await todoAPI.updateTodo(id, updates);
        const index = todos.value.findIndex(t => t.id === id);
        if (index !== -1) {
          todos.value[index] = updatedTodo;
        }
      }
    } catch (err) {
      console.error('Error updating todo:', err);
      error.value = 'Failed to update todo. Please try again.';
    } finally {
      isLoading.value = false;
    }
  };

  // Set filter
  const setFilter = (newFilter) => {
    filter.value = newFilter;
  };

  return {
    todos,
    filter,
    isLoading,
    error,
    filteredTodos,
    loadTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    setFilter
  };
}); 