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
import { z } from "zod";

const imageSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
});

interface EditImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { url: string; title: string; subtitle?: string }) => void;
  initialData?: { url: string; title: string; subtitle?: string | null };
}

export function EditImageDialog({ open, onOpenChange, onSubmit, initialData }: EditImageDialogProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [errors, setErrors] = useState<{ url?: string; title?: string }>({});

  useEffect(() => {
    if (initialData) {
      setUrl(initialData.url);
      setTitle(initialData.title);
      setSubtitle(initialData.subtitle || "");
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    try {
      const data = imageSchema.parse({ url, title, subtitle: subtitle || undefined });
      onSubmit(data);
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { url?: string; title?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "url") fieldErrors.url = err.message;
          if (err.path[0] === "title") fieldErrors.title = err.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" data-testid="dialog-edit-image">
        <DialogHeader>
          <DialogTitle>Edit Image</DialogTitle>
          <DialogDescription>
            Update the image URL and details.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="aspect-square w-32 rounded-lg overflow-hidden border border-border">
                <img
                  src={url}
                  alt="Current"
                  className="w-full h-full object-cover"
                  data-testid="img-current"
                />
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-url">Image URL</Label>
                <Input
                  id="edit-url"
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  data-testid="input-edit-url"
                />
                {errors.url && <p className="text-sm text-destructive">{errors.url}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  placeholder="Image title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  data-testid="input-edit-title"
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-subtitle">Subtitle (Optional)</Label>
                <Input
                  id="edit-subtitle"
                  placeholder="Image subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  data-testid="input-edit-subtitle"
                />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel-edit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} data-testid="button-save-edit">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
