import { Plus, MoreVertical, Copy, ExternalLink, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Page {
  id: string;
  name: string;
}

interface PageTabsProps {
  pages: Page[];
  activePage: string;
  onPageChange: (pageId: string) => void;
  onAddPage: () => void;
  onEditPage: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
  onCopyLink: (pageId: string) => void;
  onOpenPreview: (pageId: string) => void;
}

export function PageTabs({ pages, activePage, onPageChange, onAddPage, onEditPage, onDeletePage, onCopyLink, onOpenPreview }: PageTabsProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-8 flex items-center gap-4">
        <ScrollArea className="flex-1">
          <div className="flex items-center gap-2 py-3">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center gap-1 group">
                <Button
                  variant={activePage === page.id ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(page.id)}
                  className="rounded-full px-6"
                  data-testid={`tab-page-${page.id}`}
                >
                  {page.name}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid={`button-page-menu-${page.id}`}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" data-testid={`menu-page-actions-${page.id}`}>
                    <DropdownMenuItem onClick={() => onCopyLink(page.id)} data-testid={`menu-item-copy-link-${page.id}`}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onOpenPreview(page.id)} data-testid={`menu-item-open-preview-${page.id}`}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open Preview
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEditPage(page.id)} data-testid={`menu-item-edit-${page.id}`}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Rename
                    </DropdownMenuItem>
                    {pages.length > 1 && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => onDeletePage(page.id)} 
                          className="text-destructive focus:text-destructive"
                          data-testid={`menu-item-delete-${page.id}`}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <Button
          variant="ghost"
          size="icon"
          onClick={onAddPage}
          className="flex-shrink-0 w-8 h-8 rounded-full"
          data-testid="button-add-page-tab"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
