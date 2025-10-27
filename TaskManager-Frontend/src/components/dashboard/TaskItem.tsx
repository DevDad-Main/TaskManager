import React, { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  Tag,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface TaskItemProps {
  task?: {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    priority?: "low" | "medium" | "high";
    completed?: boolean;
    tags?: string[];
    folderId?: string;
  };
  folders?: Array<{ id: string; name: string; color: string }>;
  onComplete?: (taskId: string, completed: boolean) => void;
  onEdit?: (task: any) => void;
  onDelete?: (taskId: string) => void;
  onUpdate?: (task: any) => void;
  viewMode?: "grid" | "list";
}

const TaskItem = ({
  task = {
    id: "1",
    title: "Sample Task",
    description: "This is a sample task description",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "medium",
    completed: false,
    tags: ["work", "important"],
    folderId: "1",
  },
  folders = [],
  onComplete = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onUpdate = () => {},
  viewMode = "grid",
}: TaskItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const priorityColors = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  const handleComplete = () => {
    onComplete(task.id, !task.completed);
  };

  const handleEdit = () => {
    onEdit(task);
  };

  const handleDelete = () => {
    onDelete(task.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.1 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="w-full"
    >
      <Card className={`w-full bg-white ${task.completed ? "opacity-70" : ""}`}>
        <CardContent className="p-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`rounded-full ${task.completed ? "text-green-600" : "text-gray-400"}`}
                        onClick={handleComplete}
                      >
                        <CheckCircle
                          className={`h-5 w-5 ${task.completed ? "fill-green-600" : ""}`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {task.completed
                          ? "Mark as incomplete"
                          : "Mark as complete"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <h3
                  className={`font-medium text-lg ${task.completed ? "line-through text-gray-500" : ""}`}
                >
                  {task.title}
                </h3>
              </div>
              <div className="flex space-x-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleEdit}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit task</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this task? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {task.description && (
              <motion.p
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="text-sm text-gray-600 pl-7"
              >
                {task.description}
              </motion.p>
            )}

            <div className="flex flex-wrap items-center gap-2 pl-7">
              {task.dueDate && (
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                </div>
              )}

              {task.priority && (
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className={`text-xs ${priorityColors[task.priority]}`}
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {task.priority}
                  </Badge>
                </div>
              )}

              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskItem;
