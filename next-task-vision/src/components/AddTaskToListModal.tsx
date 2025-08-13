import { useState, useEffect } from "react";
import { X, Clock, AlignLeft, Repeat } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface AddTaskToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: {
    title: string;
    description?: string;
    dueDate?: Date;
    allDay: boolean;
    repeat: string;
    listId: string;
  }) => void;
  listId: string;
}

export const AddTaskToListModal = ({
  isOpen,
  onClose,
  onSave,
  listId,
}: AddTaskToListModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState("12:30");
  const [allDay, setAllDay] = useState(false);
  const [repeat, setRepeat] = useState("Does not repeat");

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setTitle("");
      setDescription("");
      setDate(new Date().toISOString().split('T')[0]);
      setTime("12:30");
      setAllDay(false);
      setRepeat("Does not repeat");
    }
  }, [isOpen]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!title.trim()) return;
    setLoading(true);
    setError(null);
    const dueDate = allDay ? new Date(date) : new Date(`${date}T${time}`);
    try {
      onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate,
        allDay,
        repeat,
        listId,
      });
      onClose();
    } catch (err) {
      setError("Error adding task");
    } finally {
      setLoading(false);
    }
  };

  const repeatOptions = [
    "Does not repeat",
    "Daily",
    "Weekly on Tuesday",
    "Monthly on day 12",
    "Annually on August 12",
    "Custom",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 gap-0 relative" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', position: 'fixed' }}>
        <DialogHeader className="p-8 pb-4">
          <Input
            placeholder="Add title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-0 border-b-2 border-task-primary rounded-none px-0 text-lg font-medium focus-visible:ring-0 focus-visible:border-task-primary w-full"
            autoFocus
            style={{ minHeight: 40 }}
          />
        </DialogHeader>

        <div className="px-8 space-y-5">
          <div className="flex items-center gap-4">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <div className="flex items-center gap-2 flex-1">
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-muted border-0 rounded-md px-3 py-2 w-40"
              />
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-muted border-0 rounded-md px-3 py-2 w-32"
                disabled={allDay}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Checkbox checked={allDay} onCheckedChange={val => setAllDay(val === true)} id="allDay" />
            <label htmlFor="allDay" className="text-sm">All day</label>
          </div>

          <div className="flex items-center gap-4">
            <Select value={repeat} onValueChange={setRepeat}>
              <SelectTrigger className="bg-muted border-0 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {repeatOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start gap-4">
            <AlignLeft className="h-5 w-5 text-muted-foreground mt-2" />
            <Textarea
              placeholder="Add description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-muted border-0 resize-none w-full"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end p-8 pt-4">
          <Button 
            onClick={handleSave}
            disabled={!title.trim() || loading}
            className="bg-task-primary hover:bg-task-primary-hover text-white px-6"
            style={{ minWidth: 100 }}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
          {error && <span className="text-red-500 ml-4 text-sm">{error}</span>}
        </div>
      </DialogContent>
    </Dialog>
  );
};
