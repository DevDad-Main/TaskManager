import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { axiosApi } from "@/components/auth/AuthForms";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  tags: string[];
  folderId?: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
}

interface TaskContextType {
  tasks: Task[];
  folders: Folder[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTaskComplete: (taskId: string, completed: boolean) => Promise<void>;
  addFolder: (folderName: string) => Promise<void>;
  updateFolder: (folderId: string, newName: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchFolders: () => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosApi.get("/api/v1/tasks");
      if (response.data.success) {
        console.log("response.data.tasks", response.data.tasks);
        setTasks(response.data.tasks || []);
      }
    } catch (err: any) {
      setError("Failed to fetch tasks");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch folders from backend
  const fetchFolders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosApi.get("/api/v1/folders");
      if (response.data.success) {
        console.log("response.data.folders", response.data.folders);
        setFolders(response.data.folders || []);
      }
    } catch (err: any) {
      setError("Failed to fetch folders");
      console.error("Error fetching folders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add task
  const addTask = async (task: Omit<Task, "id">) => {
    try {
      const response = await axiosApi.post("/api/v1/tasks", task);
      if (response.data.success) {
        console.log("response.data.task", response.data.task);
        setTasks([...tasks, response.data.task]);
      }
    } catch (err: any) {
      setError("Failed to create task");
      console.error("Error creating task:", err);
      throw err;
    }
  };

  // Update task
  const updateTask = async (task: Task) => {
    try {
      const response = await axiosApi.put(`/api/v1/tasks/${task.id}`, task);
      if (response.data.success) {
        setTasks(tasks.map((t) => (t.id === task.id ? response.data.task : t)));
        // await fetchTasks();
      }
    } catch (err: any) {
      setError("Failed to update task");
      console.error("Error updating task:", err);
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (taskId: string) => {
    try {
      console.log("Deleting task:", taskId);
      const response = await axiosApi.delete(`/api/v1/tasks/${taskId}`);
      if (response.data.success) {
        setTasks(tasks.filter((t) => t.id !== taskId));
      }
    } catch (err: any) {
      setError("Failed to delete task");
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  // Toggle task completion
  const toggleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      const response = await axiosApi.patch(`/api/v1/tasks/${taskId}`, {
        completed,
      });
      if (response.data.success) {
        setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed } : t)));
      }
    } catch (err: any) {
      setError("Failed to update task");
      console.error("Error updating task:", err);
      throw err;
    }
  };

  // Add folder
  const addFolder = async (folderName: string) => {
    try {
      const response = await axiosApi.post("/api/v1/folders", {
        name: folderName,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
      if (response.data.success) {
        setFolders([...folders, response.data.folder]);
      }
    } catch (err: any) {
      setError("Failed to create folder");
      console.error("Error creating folder:", err);
      throw err;
    }
  };

  // Update folder
  const updateFolder = async (folderId: string, newName: string) => {
    try {
      const response = await axiosApi.put(`/api/v1/folders/${folderId}`, {
        name: newName,
      });
      if (response.data.success) {
        setFolders(
          folders.map((f) => (f.id === folderId ? response.data.folder : f)),
        );
      }
    } catch (err: any) {
      setError("Failed to update folder");
      console.error("Error updating folder:", err);
      throw err;
    }
  };

  // Delete folder
  const deleteFolder = async (folderId: string) => {
    try {
      const response = await axiosApi.delete(`/api/v1/folders/${folderId}`);
      if (response.data.success) {
        setFolders(folders.filter((f) => f.id !== folderId));
        // Also remove folderId from tasks
        setTasks(
          tasks.map((t) =>
            t.folderId === folderId ? { ...t, folderId: undefined } : t,
          ),
        );
      }
    } catch (err: any) {
      setError("Failed to delete folder");
      console.error("Error deleting folder:", err);
      throw err;
    }
  };

  const value: TaskContextType = {
    tasks,
    folders,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addFolder,
    updateFolder,
    deleteFolder,
    fetchTasks,
    fetchFolders,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
