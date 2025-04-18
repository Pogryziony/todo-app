import axios from 'axios';

// Create an axios instance with base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to attach the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  googleAuthUrl: `${api.defaults.baseURL}/auth/google`,
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },
  refreshGoogleToken: async () => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// Todo API endpoints
export const todoAPI = {
  getAllTodos: async () => {
    const response = await api.get('/todos');
    return response.data;
  },
  getTodoById: async (id) => {
    const response = await api.get(`/todos/${id}`);
    return response.data;
  },
  createTodo: async (todoData) => {
    const response = await api.post('/todos', todoData);
    return response.data;
  },
  updateTodo: async (id, todoData) => {
    const response = await api.put(`/todos/${id}`, todoData);
    return response.data;
  },
  deleteTodo: async (id) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  }
};

export default api; 