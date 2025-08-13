import { useState } from "react";
import { Plus, CheckCircle, Star, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface TaskSidebarProps {
  isOpen: boolean;
  selectedList: string;
  onSelectList: (listId: string) => void;
  onCreateTask: (listId?: string) => void;
  taskLists: Array<{ id: string; name: string; count: number; visible: boolean }>;
  onCreateList: () => void;
  onToggleListVisibility: (listId: string, visible: boolean) => void;
}

export const TaskSidebar = ({ 
  isOpen, 
  selectedList, 
  onSelectList, 
  onCreateTask,
  taskLists,
  onCreateList,
  onToggleListVisibility
}: TaskSidebarProps) => {
  const [isListsExpanded, setIsListsExpanded] = useState(true);

  if (!isOpen) return null;

  return (
  <aside className="w-72 bg-task-sidebar-bg border-r border-task-border flex flex-col sidebar-font">
      <div className="p-4">
        <Button
          onClick={() => onCreateTask()}
          className="w-full bg-task-primary hover:bg-task-primary-hover text-white rounded-full h-12 flex items-center justify-center gap-2 shadow-lg transition-all duration-200 text-lg font-bold px-4"
          style={{ boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10)' }}
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
            <Plus className="h-5 w-5" />
          </span>
          Create
        </Button>
      </div>

  <nav className="flex-1 px-2 sidebar-font">
        <div className="space-y-1">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-10 px-4 text-left hover:bg-task-hover group",
              selectedList === "all" && "bg-task-hover"
            )}
            onClick={() => onSelectList("all")}
          >
            <CheckCircle className="h-5 w-5 mr-3 text-task-primary font-bold" />
            <span className={cn(
              "font-bold text-base tracking-tight group-hover:text-task-primary",
              selectedList === "all" ? "text-task-primary" : "text-inherit"
            )}>All tasks</span>
          </Button>

          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start h-10 px-4 text-left hover:bg-task-hover group",
              selectedList === "starred" && "bg-task-hover"
            )}
            onClick={() => onSelectList("starred")}
          >
            <Star className="h-5 w-5 mr-3 text-muted-foreground" />
            <span className={cn(
              "font-semibold text-base tracking-tight group-hover:text-task-primary",
              selectedList === "starred" ? "text-task-primary" : "text-inherit"
            )}>Starred</span>
          </Button>
        </div>

        <div className="mt-6">
          <Button
            variant="ghost"
            className="w-full justify-between h-8 px-4 text-muted-foreground hover:bg-task-hover group"
            onClick={() => setIsListsExpanded(!isListsExpanded)}
          >
            <span className="text-sm font-semibold tracking-tight group-hover:text-task-primary">Lists</span>
            {isListsExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          {isListsExpanded && (
            <div className="mt-1 space-y-1">
              {taskLists.map((list) => (
                <div key={list.id} className="flex items-center gap-2 px-6 py-2 hover:bg-task-hover group">
                  <Checkbox
                    checked={list.visible}
                    onCheckedChange={() => onToggleListVisibility(list.id, !list.visible)}
                    className="border-task-border data-[state=checked]:bg-task-primary data-[state=checked]:border-task-primary"
                  />
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex-1 justify-between h-8 px-2 text-left hover:bg-transparent group",
                      selectedList === list.id && "bg-task-hover"
                    )}
                    onClick={() => onSelectList(list.id)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "font-bold text-sm tracking-tight group-hover:text-task-primary",
                        selectedList === list.id ? "text-task-primary" : "text-inherit"
                      )}>{list.name}</span>
                    </div>
                    {list.count > 0 && (
                      <span className="text-xs text-muted-foreground font-medium">{list.count}</span>
                    )}
                  </Button>
                </div>
              ))}

              <Button
                variant="ghost"
                className="w-full justify-start h-10 px-6 text-left hover:bg-task-hover text-task-primary group"
                onClick={onCreateList}
              >
                <Plus className="h-5 w-5 mr-3 font-bold" />
                <span className="font-bold text-sm tracking-tight group-hover:text-task-primary">Create new list</span>
              </Button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};