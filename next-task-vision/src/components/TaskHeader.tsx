import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskHeaderProps {
  onToggleSidebar: () => void;
}

export const TaskHeader = ({ onToggleSidebar }: TaskHeaderProps) => {
  return (
    <header className="h-16 border-b border-task-border bg-card px-4 flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="hover:bg-task-hover"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="logo" className="h-12 w-12" style={{ minWidth: 28, minHeight: 28 }} />
        <h1 className="text-xl font-medium text-foreground">Tasks</h1>
      </div>
    </header>
  );
};