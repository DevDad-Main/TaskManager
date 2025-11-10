export interface NewTaskBody {
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  tags: string[];
  dueDate: Date;
  folderId: string;
}

export interface UpdateTaskBody {
  title: string;
  description: string;
  priority: string;
  completed: boolean;
  tags: string[];
  dueDate: Date;
  folderId: string;
}
