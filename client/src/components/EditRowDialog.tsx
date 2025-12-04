import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditRowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string) => void;
  initialTitle?: string;
}

export function EditRowDialog({ open, onOpenChange, onSubmit, initialTitle }: EditRowDialogProps) {
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (initialTitle) {
      setTitle(initialTitle);
    }
  }, [initialTitle, open]);

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit(title);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-edit-row">
        <DialogHeader>
          <DialogTitle>Edit Row</DialogTitle>
          <DialogDescription>
            Update the title for this row.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-row-title">Row Title</Label>
            <Input
              id="edit-row-title"
              placeholder="e.g., My Collection"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-edit-row-title"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-edit-row">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim()} data-testid="button-save-row">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
