import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./TaskCard";
import { EmptyState } from "./EmptyState";
import { UpdateListModal } from "./UpdateListModal";
import { AddTaskToListModal } from "./AddTaskToListModal";

interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  starred: boolean;
  dueDate?: Date;
  listId: string;
}

interface TaskBoardProps {
  selectedList: string;
  tasks: Task[];
  taskLists: Array<{ id: string; name: string; count: number; visible: boolean }>;
  onCreateTask: (listId?: string) => void;
  onToggleTask: (taskId: string) => void;
  onToggleStar: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onEditList?: (listId: string, newName: string) => Promise<void>;
  onDeleteList?: (listId: string) => void;
  onSaveTaskToList?: (task: {
    title: string;
    description?: string;
    dueDate?: Date;
    allDay: boolean;
    repeat: string;
    listId: string;
  }) => void;
}

export const TaskBoard = ({ 
  selectedList, 
  tasks, 
  taskLists, 
  onCreateTask, 
  onToggleTask, 
  onToggleStar,
  onEditTask,
  onDeleteTask,
  onEditList,
  onDeleteList,
  onSaveTaskToList,
}: TaskBoardProps) => {
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState<{ id: string; name: string; count: number; visible: boolean } | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<{ id: string; name: string; count: number; visible: boolean } | null>(null);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [currentListId, setCurrentListId] = useState<string | null>(null);

  useEffect(() => {
    if (updateModalOpen && listToEdit) {
      setLoading(true);
      fetch(`/api/lists/${listToEdit.id}`)
        .then(res => res.json())
        .then(data => {
          setEditName(data.name || "");
          setLoading(false);
        })
        .catch(() => {
          setEditName(listToEdit.name);
          setLoading(false);
        });
    }
  }, [updateModalOpen, listToEdit]);

  const getFilteredTasks = () => {
    if (selectedList === "all") return tasks;
    if (selectedList === "starred") return tasks.filter(task => task.starred);
    return tasks.filter(task => task.listId === selectedList);
  };

  const getCurrentListName = () => {
    if (selectedList === "all") return "My Tasks";
    if (selectedList === "starred") return "Starred tasks";
    const list = taskLists.find(l => l.id === selectedList);
    return list?.name || "My Tasks";
  };

  let mainContent = null;
  if (selectedList === "all") {
    const visibleTaskLists = taskLists.filter(list => list.visible);
    
    mainContent = (
      <main className="flex-1 p-6 overflow-x-auto">
        <div className="flex gap-6 min-w-max">{visibleTaskLists.map((list) => {
            const listTasks = tasks.filter(task => task.listId === list.id);
            const incompleteTasks = listTasks.filter(task => !task.completed);
            const completedTasks = listTasks.filter(task => task.completed);

            return (
              <div key={list.id} className="w-80 flex-shrink-0">
                <div className="bg-card border border-task-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-foreground">{list.name}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-task-hover" aria-label="List options">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={e => { e.preventDefault(); e.stopPropagation(); setListToEdit(list); setUpdateModalOpen(true); }}>
                          Rename List
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={e => { e.preventDefault(); e.stopPropagation(); setListToDelete(list); setDeleteModalOpen(true); }} className="text-red-600 focus:text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Button
                    onClick={() => { setCurrentListId(list.id); setAddTaskModalOpen(true); }}
                    variant="ghost"
                    className="w-full justify-start h-10 mb-4 text-task-primary border border-task-border rounded-lg hover:bg-task-primary hover:text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add a task
                  </Button>

                  {incompleteTasks.length === 0 && completedTasks.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <div className="space-y-2">
                      {incompleteTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onToggle={onToggleTask}
                          onToggleStar={onToggleStar}
                          onEdit={onEditTask}
                          onDelete={onDeleteTask}
                        />
                      ))}

                      {completedTasks.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-xs font-medium text-muted-foreground mb-2">
                            Completed ({completedTasks.length})
                          </h4>
                          {completedTasks.map((task) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              onToggle={onToggleTask}
                              onToggleStar={onToggleStar}
                              onEdit={onEditTask}
                              onDelete={onDeleteTask}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    );
  } else if (selectedList === "starred") {
    const starredTasks = tasks.filter(task => task.starred);
    const incompleteTasks = starredTasks.filter(task => !task.completed);
    const completedTasks = starredTasks.filter(task => task.completed);

    mainContent = (
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium text-foreground">Starred tasks</h2>
            <Button variant="ghost" size="icon" className="hover:bg-task-hover">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          <Button
            onClick={() => onCreateTask()}
            variant="ghost"
            className="w-full justify-start h-12 mb-6 text-task-primary border border-task-border rounded-lg hover:bg-task-primary hover:text-white"
          >
            <Plus className="h-5 w-5 mr-3" />
            Add a starred task
          </Button>

          {starredTasks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {incompleteTasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Starred recently
                  </h3>
                  {incompleteTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={onToggleTask}
                      onToggleStar={onToggleStar}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              )}

              {completedTasks.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Completed ({completedTasks.length})
                  </h3>
                  {completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={onToggleTask}
                      onToggleStar={onToggleStar}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    );
  } else {
    const filteredTasks = getFilteredTasks();
    const incompleteTasks = filteredTasks.filter(task => !task.completed);
    const completedTasks = filteredTasks.filter(task => task.completed);

    mainContent = (
      <main className="flex-1 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium text-foreground">{getCurrentListName()}</h2>
            <Button variant="ghost" size="icon" className="hover:bg-task-hover">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          <Button
            onClick={() => { setCurrentListId(selectedList); setAddTaskModalOpen(true); }}
            variant="ghost"
            className="w-full justify-start h-12 mb-6 text-task-primary border border-task-border rounded-lg hover:bg-task-primary hover:text-white"
          >
            <Plus className="h-5 w-5 mr-3" />
            Add a task
          </Button>

          {incompleteTasks.length === 0 && completedTasks.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {incompleteTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={onToggleTask}
                  onToggleStar={onToggleStar}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}

              {completedTasks.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">
                    Completed ({completedTasks.length})
                  </h3>
                  {completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={onToggleTask}
                      onToggleStar={onToggleStar}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <>
      {mainContent}
      <UpdateListModal
        isOpen={updateModalOpen}
        initialName={editName}
        onClose={() => { setUpdateModalOpen(false); setListToEdit(null); setEditName(""); }}
        onSave={async (newName) => {
          if (listToEdit && onEditList) {
            try {
              await onEditList(listToEdit.id, newName);
              setUpdateModalOpen(false);
              setListToEdit(null);
              setEditName("");
            } catch (e) {
              // Optionally show error toast here
            }
          }
        }}
      />

      <Dialog open={deleteModalOpen} onOpenChange={(open) => { if (!open) { setDeleteModalOpen(false); setListToDelete(null); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-normal text-center">Delete list</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center">Are you sure you want to delete <b>{listToDelete?.name}</b>? This cannot be undone.</div>
            <div className="flex justify-end gap-4">
              <button className="px-4 py-2 rounded bg-muted text-foreground" onClick={() => { setDeleteModalOpen(false); setListToDelete(null); }}>Cancel</button>
              <button className="px-4 py-2 rounded bg-red-600 text-white" onClick={async () => {
                if (listToDelete && onDeleteList) {
                  await onDeleteList(listToDelete.id);
                }
                setDeleteModalOpen(false);
                setListToDelete(null);
              }}>Delete</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {currentListId && (
        <AddTaskToListModal
          isOpen={addTaskModalOpen}
          onClose={() => { setAddTaskModalOpen(false); setCurrentListId(null); }}
          onSave={onSaveTaskToList || (() => {})}
          listId={currentListId}
        />
      )}
    </>
  );
};
