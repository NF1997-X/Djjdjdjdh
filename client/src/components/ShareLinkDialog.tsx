import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, ExternalLink } from "lucide-react";

interface ShareLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
}

export function ShareLinkDialog({ open, onOpenChange, shareUrl }: ShareLinkDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback: select the text
      const input = document.getElementById('share-url-input') as HTMLInputElement;
      if (input) {
        input.select();
        try {
          document.execCommand('copy');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (e) {
          console.error('Copy failed:', e);
        }
      }
    }
  };

  const handleOpenPreview = () => {
    window.open(shareUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Preview Link</DialogTitle>
          <DialogDescription>
            Anyone with this link can view this page in read-only mode.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Input
              id="share-url-input"
              value={shareUrl}
              readOnly
              className="flex-1"
            />
            <Button size="icon" onClick={handleCopy} variant="outline">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Button onClick={handleOpenPreview} className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
