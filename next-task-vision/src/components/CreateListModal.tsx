import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (listName: string) => void;
}

export const CreateListModal = ({ isOpen, onClose, onSave }: CreateListModalProps) => {
  const [listName, setListName] = useState("");

  const handleSave = () => {
    if (listName.trim()) {
      onSave(listName.trim());
      setListName("");
      onClose();
    }
  };

  const handleCancel = () => {
    setListName("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-normal text-center">Create new list</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Input
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="Enter name"
            className="border-0 border-b-2 border-task-primary rounded-none px-0 pb-2 focus-visible:ring-0 focus-visible:border-task-primary"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />
          
          <div className="flex justify-end gap-4">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="text-task-primary hover:bg-task-hover"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!listName.trim()}
              className="bg-task-primary hover:bg-task-primary-hover text-white"
            >
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};