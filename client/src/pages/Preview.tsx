import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { HorizontalScrollRow, ImageItem } from "@/components/HorizontalScrollRow";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useQuery } from "@tanstack/react-query";
import type { Page, Row, GalleryImage, ShareLink } from "@shared/schema";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";

interface RowWithImages extends Row {
  images: GalleryImage[];
}

export default function Preview() {
  const [, params] = useRoute("/preview/:shortCode");
  const shortCode = params?.shortCode || "";

  const lightGalleryRef = useRef<any>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<{ src: string; thumb: string }[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const { data: shareLink, isLoading: shareLinkLoading, error: shareLinkError } = useQuery<ShareLink>({
    queryKey: ["/api/share-links", shortCode],
    queryFn: async () => {
      const response = await fetch(`/api/share-links/${shortCode}`);
      if (!response.ok) throw new Error("Share link not found");
      const data = await response.json();
      // Convert snake_case to camelCase
      return {
        ...data,
        pageId: data.page_id || data.pageId,
        shortCode: data.short_code || data.shortCode,
      };
    },
    enabled: !!shortCode,
  });

  const { data: page, isLoading: pageLoading } = useQuery<Page>({
    queryKey: ["/api/pages", shareLink?.pageId],
    queryFn: async () => {
      if (!shareLink?.pageId) throw new Error("No page ID");
      const response = await fetch(`/api/pages/${shareLink.pageId}`);
      if (!response.ok) throw new Error("Failed to fetch page");
      return response.json();
    },
    enabled: !!shareLink?.pageId,
  });

  const { data: rows = [], isLoading: rowsLoading } = useQuery<Row[]>({
    queryKey: ["/api/pages", shareLink?.pageId, "rows"],
    queryFn: async () => {
      if (!shareLink?.pageId) return [];
      const response = await fetch(`/api/pages/${shareLink.pageId}/rows`);
      if (!response.ok) throw new Error("Failed to fetch rows");
      return response.json();
    },
    enabled: !!shareLink?.pageId,
  });

  const { data: allImages = [] } = useQuery<GalleryImage[]>({
    queryKey: ["/api/images", shareLink?.pageId],
    queryFn: async () => {
      const imagePromises = rows.map((row) =>
        fetch(`/api/rows/${row.id}/images`).then((res) => res.json())
      );
      const imageArrays = await Promise.all(imagePromises);
      // Convert snake_case to camelCase for images
      return imageArrays.flat().map((img: any) => ({
        ...img,
        rowId: img.row_id || img.rowId,
      }));
    },
    enabled: rows.length > 0,
  });

  const rowsWithImages: RowWithImages[] = rows.map((row) => ({
    ...row,
    images: allImages.filter((img) => img.rowId === row.id),
  }));

  const handleImageClick = (rowImages: GalleryImage[], index: number) => {
    const images = rowImages.map((img) => ({ src: img.url, thumb: img.url }));
    setLightboxImages(images);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  useEffect(() => {
    if (lightboxOpen && lightGalleryRef.current && lightboxImages.length > 0) {
      setTimeout(() => {
        lightGalleryRef.current?.openGallery(lightboxIndex);
      }, 50);
    }
  }, [lightboxOpen]);
  if (shareLinkLoading || pageLoading || rowsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading preview...</div>
      </div>
    );
  }

  if (shareLinkError || !shareLink || !page) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Preview Not Found</h1>
          <p className="text-muted-foreground">This preview link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-preview-title">{page.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">Read-only preview</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {rowsWithImages.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            No content to display
          </div>
        ) : (
          <div className="space-y-12">
            {rowsWithImages.map((row) => (
              <HorizontalScrollRow
                key={row.id}
                title={row.title}
                images={row.images}
                onImageClick={(_, index) => handleImageClick(row.images, index)}
                data-testid={`row-preview-${row.id}`}
              />
            ))}
          </div>
        )}
      </main>

      {lightboxOpen && lightboxImages.length > 0 && (
        <LightGallery
          onInit={(detail) => {
            lightGalleryRef.current = detail.instance;
          }}
          dynamic
          dynamicEl={lightboxImages}
          plugins={[lgThumbnail, lgZoom]}
          onAfterClose={() => setLightboxOpen(false)}
          speed={500}
          mode="lg-slide-circular-up"
          loop={false}
        />
      )}
    </div>
  );
}
