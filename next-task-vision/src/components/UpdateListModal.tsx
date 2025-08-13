import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UpdateListModalProps {
  isOpen: boolean;
  initialName: string;
  onClose: () => void;
  onSave: (newName: string) => Promise<void>;
}

export const UpdateListModal = ({ isOpen, initialName, onClose, onSave }: UpdateListModalProps) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    setName(initialName);
  }, [initialName, isOpen]);

  const handleSave = async () => {
    if (name.trim()) {
      await onSave(name.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-normal text-center">Rename list</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter new name"
            className="border-0 border-b-2 border-task-primary rounded-none px-0 pb-2 focus-visible:ring-0 focus-visible:border-task-primary"
            onKeyDown={e => e.key === "Enter" && handleSave()}
            autoFocus
          />
          <div className="flex justify-end gap-4">
            <Button variant="ghost" onClick={onClose} className="text-task-primary hover:bg-task-hover">Cancel</Button>
            <Button onClick={handleSave} disabled={!name.trim()} className="bg-task-primary hover:bg-task-primary-hover text-white">Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
