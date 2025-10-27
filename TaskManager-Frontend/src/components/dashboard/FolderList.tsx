import React, { useState } from "react";
import {
  Folder,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Folder {
  id: string;
  name: string;
  tasks?: number;
  completedCount?: number;
  activeCount?: number;
  totalCount?: number;
  isExpanded?: boolean;
  completedTasks?: Task[];
  activeTasks?: Task[];
}

interface FolderListProps {
  folders?: Folder[];
  onFolderSelect?: (folderId: string) => void;
  onFolderCreate?: (folderName: string) => void;
  onFolderEdit?: (folderId: string, newName: string) => void;
  onFolderDelete?: (folderId: string) => void;
  selectedFolderId?: string;
}

const FolderList: React.FC<FolderListProps> = ({
  folders = [
    { 
      id: "1", 
      name: "Personal", 
      tasks: 5, 
      completedCount: 2, 
      activeCount: 3, 
      totalCount: 5, 
      isExpanded: true,
      completedTasks: [
        { id: "1", title: "Buy groceries", completed: true },
        { id: "2", title: "Call dentist", completed: true }
      ],
      activeTasks: [
        { id: "3", title: "Finish report", completed: false },
        { id: "4", title: "Review emails", completed: false },
        { id: "5", title: "Plan vacation", completed: false }
      ]
    },
    { id: "2", name: "Work", tasks: 8, completedCount: 3, activeCount: 5, totalCount: 8, isExpanded: false },
    { id: "3", name: "Shopping", tasks: 3, completedCount: 1, activeCount: 2, totalCount: 3, isExpanded: false },
    { id: "4", name: "Health", tasks: 2, completedCount: 0, activeCount: 2, totalCount: 2, isExpanded: false },
    { id: "5", name: "Finance", tasks: 4, completedCount: 2, activeCount: 2, totalCount: 4, isExpanded: false },
  ],
  onFolderSelect = () => {},
  onFolderCreate = () => {},
  onFolderEdit = () => {},
  onFolderDelete = () => {},
  selectedFolderId = "1",
}) => {
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >(
    folders.reduce(
      (acc, folder) => ({
        ...acc,
        [folder.id]: folder.isExpanded || false,
      }),
      {},
    ),
  );
  const [expandedCompletedSections, setExpandedCompletedSections] = useState<Record<string, boolean>>({});
  const [expandedActiveSections, setExpandedActiveSections] = useState<Record<string, boolean>>({});
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [editedFolderName, setEditedFolderName] = useState("");
  const [folderToDelete, setFolderToDelete] = useState<Folder | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const toggleCompletedSection = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCompletedSections((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const toggleActiveSection = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedActiveSections((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onFolderCreate(newFolderName.trim());
      setNewFolderName("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleEditFolder = () => {
    if (editingFolder && editedFolderName.trim()) {
      onFolderEdit(editingFolder.id, editedFolderName.trim());
      setEditingFolder(null);
      setEditedFolderName("");
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteFolder = () => {
    if (folderToDelete) {
      onFolderDelete(folderToDelete.id);
      setFolderToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (folder: Folder) => {
    setEditingFolder(folder);
    setEditedFolderName(folder.name);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (folder: Folder) => {
    setFolderToDelete(folder);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="h-full flex flex-col bg-white/50 backdrop-blur-sm border rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 flex justify-between items-center border-b bg-white/80">
        <h2 className="text-lg font-semibold">Folders</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <FolderPlus className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                placeholder="Folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full"
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateFolder}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <AnimatePresence>
            {folders.map((folder) => (
              <motion.div
                key={folder.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={cn(
                    "flex items-center p-2 rounded-md mb-1 cursor-pointer group hover:bg-accent/50 transition-colors",
                    selectedFolderId === folder.id && "bg-accent",
                  )}
                  onClick={() => onFolderSelect(folder.id)}
                >
                  <button
                    className="mr-1 p-1 rounded-sm hover:bg-accent"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolder(folder.id);
                    }}
                  >
                    {expandedFolders[folder.id] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  <Folder className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="flex-1 truncate font-medium">{folder.name}</span>
                  <span className="text-xs text-muted-foreground mr-2 font-semibold">
                    {folder.totalCount || folder.tasks || 0}
                  </span>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(folder)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(folder)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <AnimatePresence>
                  {expandedFolders[folder.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-6 pl-2 border-l-2 border-border mb-2"
                    >
                      <div className="py-2 space-y-2">
                        {(folder.totalCount || folder.tasks || 0) > 0 ? (
                          <div className="space-y-2">
                            {/* Completed Tasks Section */}
                            {(folder.completedCount || 0) > 0 && (
                              <div className="rounded bg-green-50 border border-green-200 overflow-hidden">
                                <div 
                                  className="flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-green-100 transition-colors"
                                  onClick={(e) => toggleCompletedSection(folder.id, e)}
                                >
                                  <div className="flex items-center gap-1">
                                    {expandedCompletedSections[folder.id] ? (
                                      <ChevronDown className="h-3 w-3 text-green-700" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3 text-green-700" />
                                    )}
                                    <span className="text-xs font-medium text-green-700">
                                      ✓ Completed
                                    </span>
                                  </div>
                                  <span className="text-xs font-bold text-green-700">
                                    {folder.completedCount || 0}
                                  </span>
                                </div>
                                <AnimatePresence>
                                  {expandedCompletedSections[folder.id] && folder.completedTasks && folder.completedTasks.length > 0 && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="px-2 pb-2 space-y-1"
                                    >
                                      {folder.completedTasks.map((task) => (
                                        <div
                                          key={task.id}
                                          className="text-xs text-green-800 pl-2 py-0.5 truncate line-through opacity-75"
                                        >
                                          • {task.title}
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}

                            {/* Active Tasks Section */}
                            {(folder.activeCount || 0) > 0 && (
                              <div className="rounded bg-blue-50 border border-blue-200 overflow-hidden">
                                <div 
                                  className="flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-blue-100 transition-colors"
                                  onClick={(e) => toggleActiveSection(folder.id, e)}
                                >
                                  <div className="flex items-center gap-1">
                                    {expandedActiveSections[folder.id] ? (
                                      <ChevronDown className="h-3 w-3 text-blue-700" />
                                    ) : (
                                      <ChevronRight className="h-3 w-3 text-blue-700" />
                                    )}
                                    <span className="text-xs font-medium text-blue-700">
                                      ○ Active
                                    </span>
                                  </div>
                                  <span className="text-xs font-bold text-blue-700">
                                    {folder.activeCount || 0}
                                  </span>
                                </div>
                                <AnimatePresence>
                                  {expandedActiveSections[folder.id] && folder.activeTasks && folder.activeTasks.length > 0 && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="px-2 pb-2 space-y-1"
                                    >
                                      {folder.activeTasks.map((task) => (
                                        <div
                                          key={task.id}
                                          className="text-xs text-blue-800 pl-2 py-0.5 truncate font-medium"
                                        >
                                          • {task.title}
                                        </div>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground px-2 py-1">
                            No tasks
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Edit Folder Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Folder</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Folder name"
              value={editedFolderName}
              onChange={(e) => setEditedFolderName(e.target.value)}
              className="w-full"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEditFolder}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Folder Alert Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the folder "{folderToDelete?.name}" and
              potentially affect tasks within it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFolder}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FolderList;