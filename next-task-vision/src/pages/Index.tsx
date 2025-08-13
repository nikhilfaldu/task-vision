import { useState, useEffect } from "react";
import { TaskHeader } from "@/components/TaskHeader";
import { TaskSidebar } from "@/components/TaskSidebar";
import { TaskBoard } from "@/components/TaskBoard";
import { AddTaskModal } from "@/components/AddTaskModal";
import { CreateListModal } from "@/components/CreateListModal";
import { UpdateTaskModal } from "@/components/UpdateTaskModal";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  starred: boolean;
  dueDate?: Date;
  listId: string;
  allDay?: boolean;
  repeat?: string;
}

interface TaskList {
  id: string;
  name: string;
  count: number;
  visible: boolean;
}

const Index = () => {
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedList, setSelectedList] = useState("all");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isCreateListModalOpen, setIsCreateListModalOpen] = useState(false);
  const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      // Convert dueDate strings to Date objects
      const tasksWithDate = data.map((task: Task) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
      setTasks(tasksWithDate);
    } catch {
      toast({ title: "Error", description: "Could not fetch tasks." });
    }
  };

  // Fetch lists from backend
  const fetchLists = async () => {
    const res = await fetch('/api/lists');
    const lists = await res.json();
    setTaskLists(lists);
  };

  useEffect(() => {
    fetchLists();
    fetchTasks();
  }, []);

  // Save task to a particular list and refresh tasks instantly
  const handleSaveTaskToList = async (taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    allDay: boolean;
    repeat: string;
    listId: string;
  }) => {
    try {
      const payload = {
        title: taskData.title,
        description: taskData.description,
        dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : undefined,
        allDay: taskData.allDay,
        repeat: taskData.repeat,
        listId: taskData.listId,
      };
      const res = await fetch(`/api/lists/${taskData.listId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const error = await res.json();
        toast({ title: "Error", description: error.error || "Could not create task." });
        return;
      }
      await fetchTasks();
      toast({
        title: "Task created",
        description: `"${taskData.title}" has been added to your list.`,
      });
    } catch (err) {
      toast({ title: "Error", description: "Could not create task." });
    }
  };

  // Handle task update
  const handleUpdateTask = async (task: Task) => {
    try {
      const payload = {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
        allDay: task.allDay,
        repeat: task.repeat,
        completed: task.completed,
        starred: task.starred,
      };
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const error = await res.json();
        toast({ title: "Error", description: error.error || "Could not update task." });
        return;
      }
      await fetchTasks();
      toast({
        title: "Task updated",
        description: `"${task.title}" has been updated.`,
      });
    } catch (err) {
      toast({ title: "Error", description: "Could not update task." });
    }
  };

  // Edit and Delete handlers for TaskCard dropdown
  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsUpdateTaskModalOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast({ title: "Task deleted", description: `Task has been deleted.` });
    } catch {
      toast({ title: "Error", description: "Could not delete task." });
    }
  };

  // Edit and Delete handlers for List dropdown
  const handleEditList = async (listId: string, newName: string) => {
    try {
      const res = await fetch(`/api/lists/${listId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });
      if (!res.ok) throw new Error('Failed to update list');
      await fetchLists();
      toast({ title: "List updated", description: `List renamed successfully` });
    } catch {
      toast({ title: "Error", description: "Could not update list." });
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      const res = await fetch(`/api/lists/${listId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete list');
      setTaskLists(prev => prev.filter(l => l.id !== listId));
      toast({ title: "List deleted", description: `List has been deleted.` });
    } catch {
      toast({ title: "Error", description: "Could not delete list." });
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCreateTask = (listId?: string) => {
    setIsAddTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: Date;
    listId: string;
  }) => {
    try {
      const payload = {
        title: taskData.title,
        description: taskData.description,
        completed: false,
        starred: false,
        dueDate: taskData.dueDate ? taskData.dueDate.toISOString() : undefined,
        listId: taskData.listId,
      };

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        toast({ title: "Error", description: error.error || "Could not create task." });
        return;
      }

      const newTask = await res.json();
      await fetchTasks();

      setTaskLists(prev => prev.map(list =>
        list.id === newTask.listId
          ? { ...list, count: list.count + 1 }
          : list
      ));

      toast({
        title: "Task created",
        description: `"${newTask.title}" has been added to your tasks.`,
      });
    } catch (err) {
      toast({ title: "Error", description: "Could not create task." });
    }
  };

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newCompleted = !task.completed;
    fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: newCompleted })
    })
      .then(res => {
        if (!res.ok) {
          toast({ title: "Error", description: "Could not update task status." });
          return;
        }
        fetchTasks();
        setTaskLists(prevLists => prevLists.map(list =>
          list.id === task.listId
            ? { 
                ...list, 
                count: newCompleted ? list.count - 1 : list.count + 1 
              }
            : list
        ));
      })
      .catch(() => {
        toast({ title: "Error", description: "Could not update task status." });
      });
  };

  const handleToggleStar = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starred: !task.starred })
      });
      if (!res.ok) {
        toast({ title: "Error", description: "Could not update starred status." });
        return;
      }
      await fetchTasks();
      toast({ title: "Task updated", description: `Task has been ${!task.starred ? "starred" : "unstarred"}.` });
    } catch {
      toast({ title: "Error", description: "Could not update starred status." });
    }
  };

  const handleCreateList = () => {
    setIsCreateListModalOpen(true);
  };

  const handleSaveList = async (listName: string) => {
    try {
      const res = await fetch('/api/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: listName })
      });
      if (!res.ok) throw new Error('Failed to create list');
      const newList = await res.json();
      setTaskLists(prev => [...prev, newList]);
      toast({
        title: "List created",
        description: `"${listName}" list has been created.`,
      });
    } catch {
      toast({ title: "Error", description: "Could not create list." });
    }
  };

  const handleToggleListVisibility = async (listId: string, visible: boolean) => {
    try {
      const res = await fetch(`/api/lists/${listId}/visible`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible })
      });
      if (!res.ok) throw new Error('Failed to update visibility');
      const updated = await res.json();
      setTaskLists(prev => prev.map(list => list.id === listId ? { ...list, visible } : list));
    } catch {
      toast({ title: "Error", description: "Could not update list visibility." });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TaskHeader onToggleSidebar={handleToggleSidebar} />
      
      <div className="flex flex-1">
        <TaskSidebar
          isOpen={isSidebarOpen}
          selectedList={selectedList}
          onSelectList={setSelectedList}
          onCreateTask={handleCreateTask}
          taskLists={Array.isArray(taskLists) ? taskLists : []}
          onCreateList={handleCreateList}
          onToggleListVisibility={handleToggleListVisibility}
        />

        <TaskBoard
          selectedList={selectedList}
          tasks={Array.isArray(tasks) ? tasks : []}
          taskLists={Array.isArray(taskLists) ? taskLists : []}
          onCreateTask={handleCreateTask}
          onToggleTask={handleToggleTask}
          onToggleStar={handleToggleStar}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onEditList={handleEditList}
          onDeleteList={handleDeleteList}
          onSaveTaskToList={handleSaveTaskToList}
        />
      </div>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSave={handleSaveTask}
        taskLists={Array.isArray(taskLists) ? taskLists : []}
        defaultListId={selectedList === "all" || selectedList === "starred" ? "my-tasks" : selectedList}
      />

      <CreateListModal
        isOpen={isCreateListModalOpen}
        onClose={() => setIsCreateListModalOpen(false)}
        onSave={handleSaveList}
      />

      {taskToEdit && (
        <UpdateTaskModal
          isOpen={isUpdateTaskModalOpen}
          onClose={() => {
            setIsUpdateTaskModalOpen(false);
            setTaskToEdit(null);
          }}
          onSave={handleUpdateTask}
          task={taskToEdit}
        />
      )}
    </div>
  );
};

export default Index;