import { useState, useEffect, useRef } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from "lucide-react";
import { z } from "zod";

const imageSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
});

interface AddImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { url: string; title: string; subtitle?: string }) => void;
  isLoading?: boolean;
}

export function AddImageDialog({ open, onOpenChange, onSubmit, isLoading = false }: AddImageDialogProps) {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [errors, setErrors] = useState<{ url?: string; title?: string }>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<"url" | "file">("url");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog closes (transitions from open to closed)
  useEffect(() => {
    if (!open && !isLoading) {
      setUrl("");
      setTitle("");
      setSubtitle("");
      setPreviewUrl(null);
      setErrors({});
      setSelectedFile(null);
      setUploadMode("url");
      setUploading(false);
    }
  }, [open, isLoading]);

  const handleUrlChange = (value: string) => {
    setUrl(value);
    try {
      new URL(value);
      setPreviewUrl(value);
      setErrors((prev) => ({ ...prev, url: undefined }));
    } catch {
      setPreviewUrl(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL for the selected file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors({});
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          // More aggressive compression - smaller max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions maintaining aspect ratio
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round(height * (MAX_WIDTH / width));
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round(width * (MAX_HEIGHT / height));
              height = MAX_HEIGHT;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw with better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          // Start with lower quality and keep reducing if needed
          let quality = 0.7;
          let compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          
          // Keep under 2MB to be safe (base64 adds ~33% overhead)
          const maxSize = 2 * 1024 * 1024;
          
          while (compressedBase64.length > maxSize && quality > 0.3) {
            quality -= 0.05;
            compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          }
          
          console.log(`Compressed image: ${(compressedBase64.length / 1024 / 1024).toFixed(2)}MB, quality: ${quality}`);
          
          resolve(compressedBase64);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleUploadFile = async () => {
    if (!selectedFile) {
      setErrors({ url: "Please select a file" });
      return null;
    }

    setUploading(true);
    try {
      // Compress image before upload
      const compressedBase64 = await compressImage(selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: compressedBase64 }),
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      setErrors({ url: "Failed to upload image" });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    let imageUrl = url;

    // If file upload mode, upload the file first
    if (uploadMode === "file") {
      const uploadedUrl = await handleUploadFile();
      if (!uploadedUrl) return;
      imageUrl = uploadedUrl;
    }

    try {
      const data = imageSchema.parse({ url: imageUrl, title, subtitle: subtitle || undefined });
      onSubmit(data);
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

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      onOpenChange(false);
    } else if (newOpen) {
      onOpenChange(true);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl" data-testid="dialog-add-image">
        <DialogHeader>
          <DialogTitle>Add New Image</DialogTitle>
          <DialogDescription>
            Upload an image file or enter an image URL to add it to the gallery.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Tabs value={uploadMode} onValueChange={(value) => setUploadMode(value as "url" | "file")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">Image URL</TabsTrigger>
              <TabsTrigger value="file">Upload File</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Image URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com/image.jpg"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  data-testid="input-image-url"
                />
                {errors.url && <p className="text-sm text-destructive">{errors.url}</p>}
              </div>
            </TabsContent>
            
            <TabsContent value="file" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Choose Image File</Label>
                <div className="flex gap-2">
                  <Input
                    id="file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="cursor-pointer"
                    data-testid="input-image-file"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="shrink-0"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Browse
                  </Button>
                </div>
                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
                {errors.url && <p className="text-sm text-destructive">{errors.url}</p>}
              </div>
            </TabsContent>
          </Tabs>

          {previewUrl && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="aspect-square w-full max-w-xs rounded-lg overflow-hidden border border-border">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setPreviewUrl(null)}
                  data-testid="img-preview"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Image title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-testid="input-image-title"
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle (Optional)</Label>
            <Input
              id="subtitle"
              placeholder="Image subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              data-testid="input-image-subtitle"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading || uploading} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || uploading} data-testid="button-submit-image">
            {uploading ? "Uploading..." : isLoading ? "Adding..." : "Add Image"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
