import { type Page, type Row, type GalleryImage, type ShareLink, type InsertPage, type InsertRow, type InsertImage, type InsertShareLink } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Pages
  getAllPages(): Promise<Page[]>;
  getPage(id: string): Promise<Page | undefined>;
  createPage(page: Omit<InsertPage, "order">): Promise<Page>;
  updatePage(id: string, page: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: string): Promise<void>;

  // Rows
  getRowsByPage(pageId: string): Promise<Row[]>;
  getRow(id: string): Promise<Row | undefined>;
  createRow(row: Omit<InsertRow, "order">): Promise<Row>;
  updateRow(id: string, row: Partial<InsertRow>): Promise<Row | undefined>;
  deleteRow(id: string): Promise<void>;

  // Images
  getImagesByRow(rowId: string): Promise<GalleryImage[]>;
  getImage(id: string): Promise<GalleryImage | undefined>;
  createImage(image: Omit<InsertImage, "order">): Promise<GalleryImage>;
  updateImage(id: string, image: Partial<InsertImage>): Promise<GalleryImage | undefined>;
  deleteImage(id: string): Promise<void>;

  // Share Links
  getShareLinkByCode(shortCode: string): Promise<ShareLink | undefined>;
  getShareLinkByPageId(pageId: string): Promise<ShareLink | undefined>;
  createShareLink(shareLink: InsertShareLink): Promise<ShareLink>;
}

export class MemStorage implements IStorage {
  private pages: Map<string, Page>;
  private rows: Map<string, Row>;
  private images: Map<string, GalleryImage>;
  private shareLinks: Map<string, ShareLink>;

  constructor() {
    this.pages = new Map();
    this.rows = new Map();
    this.images = new Map();
    this.shareLinks = new Map();

    // Initialize with sample data
    const page1: Page = { id: randomUUID(), name: "Gallery 1", order: 0 };
    const page2: Page = { id: randomUUID(), name: "Gallery 2", order: 1 };
    this.pages.set(page1.id, page1);
    this.pages.set(page2.id, page2);

    const row1: Row = { id: randomUUID(), pageId: page1.id, title: "Nature Collection", order: 0 };
    const row2: Row = { id: randomUUID(), pageId: page1.id, title: "Urban Photography", order: 1 };
    const row3: Row = { id: randomUUID(), pageId: page2.id, title: "Abstract Art", order: 0 };
    this.rows.set(row1.id, row1);
    this.rows.set(row2.id, row2);
    this.rows.set(row3.id, row3);

    const sampleImages = [
      { rowId: row1.id, url: "https://picsum.photos/id/112/300/300", title: "Mountain View", subtitle: "Beautiful landscape", order: 0 },
      { rowId: row1.id, url: "https://picsum.photos/id/122/300/300", title: "Ocean Waves", subtitle: "Seascape", order: 1 },
      { rowId: row1.id, url: "https://picsum.photos/id/132/300/300", title: "Forest Path", subtitle: "Nature trail", order: 2 },
      { rowId: row1.id, url: "https://picsum.photos/id/142/300/300", title: "Desert Sunset", subtitle: "Golden hour", order: 3 },
      { rowId: row1.id, url: "https://picsum.photos/id/152/300/300", title: "River Flow", subtitle: "Waterscape", order: 4 },
      { rowId: row1.id, url: "https://picsum.photos/id/162/300/300", title: "Snow Peak", subtitle: "Winter scene", order: 5 },
      { rowId: row2.id, url: "https://picsum.photos/id/172/300/300", title: "City Lights", subtitle: "Night view", order: 0 },
      { rowId: row2.id, url: "https://picsum.photos/id/182/300/300", title: "Street Art", subtitle: "Graffiti", order: 1 },
      { rowId: row2.id, url: "https://picsum.photos/id/192/300/300", title: "Architecture", subtitle: "Modern building", order: 2 },
      { rowId: row2.id, url: "https://picsum.photos/id/1102/300/300", title: "Bridge", subtitle: "Infrastructure", order: 3 },
      { rowId: row3.id, url: "https://picsum.photos/id/103/300/300", title: "Color Splash", subtitle: "Abstract", order: 0 },
      { rowId: row3.id, url: "https://picsum.photos/id/113/300/300", title: "Geometric", subtitle: "Patterns", order: 1 },
      { rowId: row3.id, url: "https://picsum.photos/id/123/300/300", title: "Texture", subtitle: "Surface", order: 2 },
      { rowId: row3.id, url: "https://picsum.photos/id/133/300/300", title: "Gradient", subtitle: "Colors", order: 3 },
      { rowId: row3.id, url: "https://picsum.photos/id/143/300/300", title: "Shapes", subtitle: "Forms", order: 4 },
    ];

    sampleImages.forEach((img) => {
      const image: GalleryImage = { id: randomUUID(), ...img };
      this.images.set(image.id, image);
    });
  }

  async getAllPages(): Promise<Page[]> {
    return Array.from(this.pages.values()).sort((a, b) => a.order - b.order);
  }

  async getPage(id: string): Promise<Page | undefined> {
    return this.pages.get(id);
  }

  async createPage(insertPage: Omit<InsertPage, "order">): Promise<Page> {
    const id = randomUUID();
    const allPages = Array.from(this.pages.values());
    const maxOrder = allPages.length > 0 ? Math.max(...allPages.map((p) => p.order)) : -1;
    const page: Page = { id, name: insertPage.name, order: maxOrder + 1 };
    this.pages.set(id, page);
    return page;
  }

  async updatePage(id: string, pageUpdate: Partial<InsertPage>): Promise<Page | undefined> {
    const page = this.pages.get(id);
    if (!page) return undefined;
    const updated = { ...page, ...pageUpdate };
    this.pages.set(id, updated);
    return updated;
  }

  async deletePage(id: string): Promise<void> {
    this.pages.delete(id);
    const rowsToDelete = Array.from(this.rows.values()).filter((r) => r.pageId === id);
    rowsToDelete.forEach((row) => {
      this.rows.delete(row.id);
      const imagesToDelete = Array.from(this.images.values()).filter((i) => i.rowId === row.id);
      imagesToDelete.forEach((img) => this.images.delete(img.id));
    });
  }

  async getRowsByPage(pageId: string): Promise<Row[]> {
    return Array.from(this.rows.values())
      .filter((r) => r.pageId === pageId)
      .sort((a, b) => a.order - b.order);
  }

  async getRow(id: string): Promise<Row | undefined> {
    return this.rows.get(id);
  }

  async createRow(insertRow: Omit<InsertRow, "order">): Promise<Row> {
    const id = randomUUID();
    const pageRows = Array.from(this.rows.values()).filter((r) => r.pageId === insertRow.pageId);
    const maxOrder = pageRows.length > 0 ? Math.max(...pageRows.map((r) => r.order)) : -1;
    const row: Row = { id, pageId: insertRow.pageId, title: insertRow.title, order: maxOrder + 1 };
    this.rows.set(id, row);
    return row;
  }

  async updateRow(id: string, rowUpdate: Partial<InsertRow>): Promise<Row | undefined> {
    const row = this.rows.get(id);
    if (!row) return undefined;
    const updated = { ...row, ...rowUpdate };
    this.rows.set(id, updated);
    return updated;
  }

  async deleteRow(id: string): Promise<void> {
    this.rows.delete(id);
    const imagesToDelete = Array.from(this.images.values()).filter((i) => i.rowId === id);
    imagesToDelete.forEach((img) => this.images.delete(img.id));
  }

  async getImagesByRow(rowId: string): Promise<GalleryImage[]> {
    return Array.from(this.images.values())
      .filter((i) => i.rowId === rowId)
      .sort((a, b) => a.order - b.order);
  }

  async getImage(id: string): Promise<GalleryImage | undefined> {
    return this.images.get(id);
  }

  async createImage(insertImage: Omit<InsertImage, "order">): Promise<GalleryImage> {
    const id = randomUUID();
    const rowImages = Array.from(this.images.values()).filter((i) => i.rowId === insertImage.rowId);
    const maxOrder = rowImages.length > 0 ? Math.max(...rowImages.map((i) => i.order)) : -1;
    const image: GalleryImage = {
      id,
      rowId: insertImage.rowId,
      url: insertImage.url,
      title: insertImage.title,
      subtitle: insertImage.subtitle ?? null,
      order: maxOrder + 1,
    };
    this.images.set(id, image);
    return image;
  }

  async updateImage(id: string, imageUpdate: Partial<InsertImage>): Promise<GalleryImage | undefined> {
    const image = this.images.get(id);
    if (!image) return undefined;
    const updated = { ...image, ...imageUpdate };
    this.images.set(id, updated);
    return updated;
  }

  async deleteImage(id: string): Promise<void> {
    this.images.delete(id);
  }

  async getShareLinkByCode(shortCode: string): Promise<ShareLink | undefined> {
    return Array.from(this.shareLinks.values()).find((link) => link.shortCode === shortCode);
  }

  async getShareLinkByPageId(pageId: string): Promise<ShareLink | undefined> {
    return Array.from(this.shareLinks.values()).find((link) => link.pageId === pageId);
  }

  async createShareLink(insertShareLink: InsertShareLink): Promise<ShareLink> {
    const id = randomUUID();
    const shareLink: ShareLink = {
      id,
      shortCode: insertShareLink.shortCode,
      pageId: insertShareLink.pageId,
      createdAt: Math.floor(Date.now() / 1000),
    };
    this.shareLinks.set(id, shareLink);
    return shareLink;
  }
}

export const storage = new MemStorage();
