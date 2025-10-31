import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finish the project proposal for the client meeting",
      dueDate: "2023-06-15",
      priority: "high",
      completed: false,
      tags: ["work", "urgent"],
      folderId: "1",
    },
    {
      id: "2",
      title: "Buy groceries",
      description: "Get milk, eggs, bread, and vegetables",
      dueDate: "2023-06-10",
      priority: "medium",
      completed: false,
      tags: ["personal"],
      folderId: "2",
    },
    {
      id: "3",
      title: "Schedule dentist appointment",
      description: "Call the dentist to schedule a check-up",
      dueDate: "2023-06-20",
      priority: "low",
      completed: true,
      tags: ["health"],
      folderId: "2",
    },
  ]);

  const [folders, setFolders] = useState<Folder[]>([
    { id: "1", name: "Work", color: "#4f46e5" },
    { id: "2", name: "Personal", color: "#10b981" },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      // const response = await api.getTasks();
      // setTasks(response.data);

      // For now, using mock data
      console.log("Fetching tasks from backend...");
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch folders from backend
  const fetchFolders = async () => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with actual API call
      // const response = await api.getFolders();
      // setFolders(response.data);

      console.log("Fetching folders from backend...");
    } catch (err) {
      setError("Failed to fetch folders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add task
  const addTask = async (task: Omit<Task, "id">) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.createTask(task);
      // setTasks([...tasks, response.data]);

      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
      };
      setTasks([...tasks, newTask]);
    } catch (err) {
      setError("Failed to create task");
      console.error(err);
    }
  };

  // Update task
  const updateTask = async (task: Task) => {
    try {
      // TODO: Replace with actual API call
      // await api.updateTask(task.id, task);

      setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    } catch (err) {
      setError("Failed to update task");
      console.error(err);
    }
  };

  // Delete task
  const deleteTask = async (taskId: string) => {
    try {
      // TODO: Replace with actual API call
      // await api.deleteTask(taskId);

      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
    }
  };

  // Toggle task completion
  const toggleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      // TODO: Replace with actual API call
      // await api.updateTask(taskId, { completed });

      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed } : t)));
    } catch (err) {
      setError("Failed to update task");
      console.error(err);
    }
  };

  // Add folder
  const addFolder = async (folderName: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.createFolder({ name: folderName });
      // setFolders([...folders, response.data]);

      const newFolder: Folder = {
        id: Date.now().toString(),
        name: folderName,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      };
      setFolders([...folders, newFolder]);
    } catch (err) {
      setError("Failed to create folder");
      console.error(err);
    }
  };

  // Update folder
  const updateFolder = async (folderId: string, newName: string) => {
    try {
      // TODO: Replace with actual API call
      // await api.updateFolder(folderId, { name: newName });

      setFolders(
        folders.map((f) => (f.id === folderId ? { ...f, name: newName } : f)),
      );
    } catch (err) {
      setError("Failed to update folder");
      console.error(err);
    }
  };

  // Delete folder
  const deleteFolder = async (folderId: string) => {
    try {
      // TODO: Replace with actual API call
      // await api.deleteFolder(folderId);

      setFolders(folders.filter((f) => f.id !== folderId));
      // Also remove folderId from tasks
      setTasks(
        tasks.map((t) =>
          t.folderId === folderId ? { ...t, folderId: undefined } : t,
        ),
      );
    } catch (err) {
      setError("Failed to delete folder");
      console.error(err);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchTasks();
    fetchFolders();
  }, []);

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
