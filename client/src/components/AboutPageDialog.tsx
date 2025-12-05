import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info, Calendar, Image, Layers } from "lucide-react";

interface Page {
  id: string;
  name: string;
  createdAt?: string;
}

interface Row {
  id: string;
  pageId: string;
}

interface ImageItem {
  id: string;
  rowId: string;
}

interface AboutPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page: Page | null;
  rows: Row[];
  images: ImageItem[];
}

export function AboutPageDialog({ open, onOpenChange, page, rows, images }: AboutPageDialogProps) {
  if (!page) return null;

  const pageRows = rows.filter(row => row.pageId === page.id);
  const rowIds = new Set(pageRows.map(r => r.id));
  const pageImages = images.filter(img => rowIds.has(img.rowId));

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            About "{page.name}"
          </DialogTitle>
          <DialogDescription>
            Information and statistics about this page
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Calendar className="w-5 h-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Created</p>
                <p className="text-sm text-muted-foreground">{formatDate(page.createdAt)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Layers className="w-5 h-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Rows</p>
                <p className="text-sm text-muted-foreground">
                  {pageRows.length} {pageRows.length === 1 ? "row" : "rows"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Image className="w-5 h-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Images</p>
                <p className="text-sm text-muted-foreground">
                  {pageImages.length} {pageImages.length === 1 ? "image" : "images"}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Page ID: <code className="bg-muted px-1 py-0.5 rounded">{page.id}</code>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
