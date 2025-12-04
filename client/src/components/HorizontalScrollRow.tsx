import { ChevronLeft, ChevronRight, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRef, useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface ImageItem {
  id: string;
  url: string;
  title: string;
  subtitle?: string | null;
}

interface HorizontalScrollRowProps {
  title: string;
  images: ImageItem[];
  onImageClick?: (image: ImageItem, index: number) => void;
  onEditRow?: () => void;
  onDeleteRow?: () => void;
  onAddImage?: () => void;
  onEditImage?: (imageId: string) => void;
  onDeleteImage?: (imageId: string) => void;
}

export function HorizontalScrollRow({
  title,
  images,
  onImageClick,
  onEditRow,
  onDeleteRow,
  onAddImage,
  onEditImage,
  onDeleteImage,
}: HorizontalScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        element.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [images]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth / 2;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="py-8 border-b border-border">
      <div className="flex items-center justify-between mb-6 px-8">
        <h2 className="text-xl font-semibold" data-testid="text-row-title">{title}</h2>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="w-10 h-10"
              data-testid="button-scroll-left"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="w-10 h-10"
              data-testid="button-scroll-right"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-10 h-10" data-testid="button-row-menu">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEditRow} data-testid="menu-edit-row">
                <Edit className="w-4 h-4 mr-2" />
                Edit Row
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDeleteRow} className="text-destructive" data-testid="menu-delete-row">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Row
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 px-8 pb-4 scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className="flex-shrink-0 w-[200px] md:w-[240px] group"
            onMouseEnter={() => setHoveredImage(image.id)}
            onMouseLeave={() => setHoveredImage(null)}
            data-testid={`card-image-${index}`}
          >
            <Card className="overflow-hidden border-card-border hover-elevate active-elevate-2 transition-all duration-300">
              <div
                className="relative aspect-square cursor-pointer overflow-hidden"
                onClick={() => onImageClick?.(image, index)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  data-testid={`img-item-${index}`}
                />
                {hoveredImage === image.id && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-opacity duration-200">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="w-8 h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditImage?.(image.id);
                      }}
                      data-testid={`button-edit-image-${index}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="w-8 h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteImage?.(image.id);
                      }}
                      data-testid={`button-delete-image-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
            <div className="mt-3 px-1">
              <h3 className="text-base font-medium truncate" data-testid={`text-title-${index}`}>{image.title}</h3>
              {image.subtitle && (
                <p className="text-sm text-muted-foreground truncate" data-testid={`text-subtitle-${index}`}>
                  {image.subtitle}
                </p>
              )}
            </div>
          </div>
        ))}

        <div
          className="flex-shrink-0 w-[200px] md:w-[240px] cursor-pointer"
          onClick={onAddImage}
          data-testid="button-add-image-card"
        >
          <Card className="aspect-square border-2 border-dashed border-border hover-elevate active-elevate-2 transition-all duration-300 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl text-muted-foreground">+</span>
              </div>
              <p className="text-sm text-muted-foreground">Add Image</p>
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
