import { CheckCircle2, Circle, Star, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  starred: boolean;
  dueDate?: Date;
  listId: string;
}

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard = ({ task, onToggle, onToggleStar, onEdit, onDelete }: TaskCardProps) => {
  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-lg hover:bg-task-hover group transition-colors",
      task.completed && "opacity-60"
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 p-0 mt-0.5 hover:bg-transparent"
        onClick={() => onToggle(task.id)}
      >
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-task-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground hover:text-task-primary" />
        )}
      </Button>

      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "text-sm font-medium",
          task.completed ? "line-through text-task-completed" : "text-foreground"
        )}>
          {task.title}
        </h3>
        {task.description && (
          <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
        )}
        {task.dueDate && task.dueDate instanceof Date && !isNaN(task.dueDate.getTime()) && (
          <p className="text-xs text-muted-foreground mt-1">
            {task.dueDate.toLocaleDateString()}
          </p>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent"
        onClick={() => onToggleStar(task.id)}
      >
        <Star className={cn(
          "h-4 w-4",
          task.starred ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground hover:text-yellow-500"
        )} />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-transparent"
            aria-label="Task options"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit && onEdit(task)}>
            Change Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onDelete && onDelete(task.id)} className="text-red-600 focus:text-red-600">
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
