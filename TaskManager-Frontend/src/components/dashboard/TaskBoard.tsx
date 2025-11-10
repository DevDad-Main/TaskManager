import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import TaskItem from "./TaskItem";
import FolderList from "./FolderList";
import { useTaskContext } from "@/contexts/TaskContext";

const TaskBoard = () => {
  const {
    tasks,
    folders,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    addFolder,
    updateFolder,
    deleteFolder,
  } = useTaskContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("active");
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [newTask, setNewTask] = useState<any>({
    title: "",
    description: "",
    priority: "medium",
    completed: false,
    tags: [],
    dueDate: undefined,
    folderId: undefined,
  });
  const [newTaskTag, setNewTaskTag] = useState("");
  const [editTaskTag, setEditTaskTag] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "completed" && task.completed) ||
        (filterStatus === "active" && !task.completed);

      const matchesFolder =
        filterFolder === "all" || task.folderId === filterFolder;

      return matchesSearch && matchesPriority && matchesStatus && matchesFolder;
    })
    .sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const handleCreateTask = () => {
    addTask(newTask);
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      completed: false,
      tags: [],
      dueDate: undefined,
      folderId: undefined,
    });
    setIsCreateDialogOpen(false);
  };

  const handleUpdateTask = () => {
    if (editingTask) {
      updateTask(editingTask);
      setEditingTask(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleEditClick = (task: any) => {
    setEditingTask({ ...task });
    setIsEditDialogOpen(true);
  };

  const handleAddTag = () => {
    if (newTaskTag.trim() && !newTask.tags.includes(newTaskTag.trim())) {
      setNewTask({
        ...newTask,
        tags: [...newTask.tags, newTaskTag.trim()],
      });
      setNewTaskTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewTask({
      ...newTask,
      tags: newTask.tags.filter((t: string) => t !== tag),
    });
  };

  const handleAddEditTag = () => {
    if (
      editingTask &&
      editTaskTag.trim() &&
      !editingTask.tags.includes(editTaskTag.trim())
    ) {
      setEditingTask({
        ...editingTask,
        tags: [...editingTask.tags, editTaskTag.trim()],
      });
      setEditTaskTag("");
    }
  };

  const handleRemoveEditTag = (tag: string) => {
    if (editingTask) {
      setEditingTask({
        ...editingTask,
        tags: editingTask.tags.filter((t: string) => t !== tag),
      });
    }
  };

  // Calculate folder stats for sidebar
  const folderStats = folders.map((folder) => {
    const folderTasks = tasks.filter((task) => task.folderId === folder.id);
    const completedTasks = folderTasks.filter((task) => task.completed);
    const activeTasks = folderTasks.filter((task) => !task.completed);

    return {
      ...folder,
      completedCount: completedTasks.length,
      activeCount: activeTasks.length,
      totalCount: folderTasks.length,
      completedTasks: completedTasks.map((t) => ({
        id: t.id,
        title: t.title,
        completed: t.completed,
      })),
      activeTasks: activeTasks.map((t) => ({
        id: t.id,
        title: t.title,
        completed: t.completed,
      })),
    };
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Hugs left edge */}
      <div className="w-80 bg-gradient-to-br from-slate-50 to-slate-100 border-r flex-shrink-0 hidden md:flex flex-col">
        <div className="h-full overflow-hidden">
          <FolderList
            folders={folderStats}
            onFolderCreate={addFolder}
            onFolderEdit={updateFolder}
            onFolderDelete={deleteFolder}
          />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-gradient-to-br from-slate-50 to-slate-100 border-r">
              <div className="h-full p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Folders</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    Close
                  </Button>
                </div>
                <FolderList
                  folders={folderStats}
                  onFolderCreate={addFolder}
                  onFolderEdit={updateFolder}
                  onFolderDelete={deleteFolder}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden p-4 border-b bg-white">
          <Button
            variant="outline"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="w-full"
          >
            {isMobileSidebarOpen ? "Hide Folders" : "Show Folders"}
          </Button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="flex flex-col space-y-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-2xl font-bold">Task Board</h1>
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    <span>New Task</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newTask.title}
                        onChange={(e) =>
                          setNewTask({ ...newTask, title: e.target.value })
                        }
                        placeholder="Task title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTask.description}
                        onChange={(e) =>
                          setNewTask({
                            ...newTask,
                            description: e.target.value,
                          })
                        }
                        placeholder="Task description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={newTask.dueDate}
                          onChange={(e) =>
                            setNewTask({ ...newTask, dueDate: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                          value={newTask.priority}
                          onValueChange={(value) =>
                            setNewTask({
                              ...newTask,
                              priority: value as "low" | "medium" | "high",
                            })
                          }
                        >
                          <SelectTrigger id="priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="folder">Folder</Label>
                      <Select
                        value={newTask.folderId}
                        onValueChange={(value) =>
                          setNewTask({ ...newTask, folderId: value })
                        }
                      >
                        <SelectTrigger id="folder">
                          <SelectValue placeholder="Select folder" />
                        </SelectTrigger>
                        <SelectContent>
                          {folders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              {folder.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          id="tags"
                          value={newTaskTag}
                          onChange={(e) => setNewTaskTag(e.target.value)}
                          placeholder="Add tag"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleAddTag}
                          variant="secondary"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newTask.tags.map((tag: string) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-xs hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateTask}
                      disabled={!newTask.title.trim()}
                    >
                      Create Task
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Edit Task Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                {editingTask && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input
                        id="edit-title"
                        value={editingTask.title}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            title: e.target.value,
                          })
                        }
                        placeholder="Task title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={editingTask.description}
                        onChange={(e) =>
                          setEditingTask({
                            ...editingTask,
                            description: e.target.value,
                          })
                        }
                        placeholder="Task description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-dueDate">Due Date</Label>
                        <Input
                          id="edit-dueDate"
                          type="date"
                          value={editingTask.dueDate}
                          onChange={(e) =>
                            setEditingTask({
                              ...editingTask,
                              dueDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-priority">Priority</Label>
                        <Select
                          value={editingTask.priority}
                          onValueChange={(value) =>
                            setEditingTask({
                              ...editingTask,
                              priority: value as "low" | "medium" | "high",
                            })
                          }
                        >
                          <SelectTrigger id="edit-priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-folder">Folder</Label>
                      <Select
                        value={editingTask.folderId}
                        onValueChange={(value) =>
                          setEditingTask({ ...editingTask, folderId: value })
                        }
                      >
                        <SelectTrigger id="edit-folder">
                          <SelectValue placeholder="Select folder" />
                        </SelectTrigger>
                        <SelectContent>
                          {folders.map((folder) => (
                            <SelectItem key={folder.id} value={folder.id}>
                              {folder.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-tags">Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          id="edit-tags"
                          value={editTaskTag}
                          onChange={(e) => setEditTaskTag(e.target.value)}
                          placeholder="Add tag"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleAddEditTag}
                          variant="secondary"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {editingTask.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveEditTag(tag)}
                              className="ml-1 text-xs hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateTask}
                    disabled={!editingTask?.title.trim()}
                  >
                    Update Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Search and Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="all">All Statuses</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterFolder} onValueChange={setFilterFolder}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by folder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Folders</SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* View Controls */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Tabs
                  value={viewMode}
                  onValueChange={(value) =>
                    setViewMode(value as "grid" | "list")
                  }
                >
                  <TabsList>
                    <TabsTrigger
                      value="grid"
                      className="flex items-center gap-1"
                    >
                      <Grid size={16} />
                      <span className="hidden sm:inline">Grid</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="list"
                      className="flex items-center gap-1"
                    >
                      <List size={16} />
                      <span className="hidden sm:inline">List</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="flex items-center gap-1"
              >
                {sortOrder === "asc" ? (
                  <SortAsc size={16} />
                ) : (
                  <SortDesc size={16} />
                )}
                <span className="hidden sm:inline">Sort by Date</span>
              </Button>
            </div>

            {/* Tasks */}
            <AnimatePresence>
              {filteredTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="flex flex-col items-center justify-center p-8 text-center"
                >
                  <div className="rounded-full bg-muted p-6 mb-4">
                    <Filter className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No tasks found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or create a new task.
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus size={16} className="mr-2" />
                    Create Task
                  </Button>
                  {/* <DialogTrigger asChild> */}
                  {/*   <Button> */}
                  {/*     <Plus size={16} className="mr-2" /> */}
                  {/*     Create Task */}
                  {/*   </Button> */}
                  {/* </DialogTrigger> */}
                </motion.div>
              ) : (
                <div
                  className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
                >
                  {filteredTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <TaskItem
                        task={task}
                        folders={folders}
                        onUpdate={updateTask}
                        onDelete={deleteTask}
                        onComplete={toggleTaskComplete}
                        onEdit={handleEditClick}
                        viewMode={viewMode}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskBoard;
