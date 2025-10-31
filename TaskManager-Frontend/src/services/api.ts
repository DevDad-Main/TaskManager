import axios from "axios";
import { Task, Folder } from "@/contexts/TaskContext";

// Configure your backend URL here
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem("authToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

// Task API endpoints
export const taskApi = {
  // Get all tasks
  getTasks: () => api.get<Task[]>("/tasks"),

  // Get single task
  getTask: (id: string) => api.get<Task>(`/tasks/${id}`),

  // Create task
  createTask: (task: Omit<Task, "id">) => api.post<Task>("/tasks", task),

  // Update task
  updateTask: (id: string, task: Partial<Task>) =>
    api.put<Task>(`/tasks/${id}`, task),

  // Delete task
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),

  // Toggle task completion
  toggleComplete: (id: string, completed: boolean) =>
    api.patch<Task>(`/tasks/${id}/complete`, { completed }),
};

// Folder API endpoints
export const folderApi = {
  // Get all folders
  getFolders: () => api.get<Folder[]>("/folders"),

  // Get single folder
  getFolder: (id: string) => api.get<Folder>(`/folders/${id}`),

  // Create folder
  createFolder: (folder: Omit<Folder, "id">) =>
    api.post<Folder>("/folders", folder),

  // Update folder
  updateFolder: (id: string, folder: Partial<Folder>) =>
    api.put<Folder>(`/folders/${id}`, folder),

  // Delete folder
  deleteFolder: (id: string) => api.delete(`/folders/${id}`),
};

// Auth API endpoints
export const authApi = {
  // Login
  login: (email: string, password: string) =>
    api.post<{ token: string; user: any }>("/auth/login", { email, password }),

  // Register
  register: (email: string, password: string, name: string) =>
    api.post<{ token: string; user: any }>("/auth/register", {
      email,
      password,
      name,
    }),

  // Logout
  logout: () => api.post("/auth/logout"),

  // Get current user
  getCurrentUser: () => api.get("/auth/me"),
};

export default api;
