import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPageSchema, insertRowSchema, insertImageSchema, updatePageSchema, updateRowSchema, updateImageSchema, insertShareLinkSchema } from "@shared/schema";
import { z } from "zod";
import { randomBytes } from "crypto";
import multer from "multer";

// Configure multer for memory storage (we'll upload to ImgBB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|bmp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Upload image to ImgBB
  app.post("/api/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const apiKey = process.env.IMGBB_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "ImgBB API key not configured" });
      }

      // Convert buffer to base64
      const base64Image = req.file.buffer.toString('base64');

      // Create URLSearchParams for form data
      const formData = new URLSearchParams();
      formData.append('image', base64Image);

      // Upload to ImgBB using fetch
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload to ImgBB');
      }

      const data = await response.json() as any;
      
      // Return the ImgBB URL
      res.json({ 
        url: data.data.url,
        display_url: data.data.display_url,
        thumb_url: data.data.thumb.url,
        medium_url: data.data.medium?.url,
        delete_url: data.data.delete_url
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Pages routes
  app.get("/api/pages", async (req, res) => {
    try {
      const pages = await storage.getAllPages();
      res.json(pages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch pages" });
    }
  });

  app.get("/api/pages/:id", async (req, res) => {
    try {
      const page = await storage.getPage(req.params.id);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch page" });
    }
  });

  app.post("/api/pages", async (req, res) => {
    try {
      const data = insertPageSchema.omit({ order: true }).parse(req.body);
      const page = await storage.createPage(data);
      res.status(201).json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create page" });
    }
  });

  app.patch("/api/pages/:id", async (req, res) => {
    try {
      const data = updatePageSchema.parse(req.body);
      const page = await storage.updatePage(req.params.id, data);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update page" });
    }
  });

  app.delete("/api/pages/:id", async (req, res) => {
    try {
      await storage.deletePage(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete page" });
    }
  });

  // Rows routes
  app.get("/api/pages/:pageId/rows", async (req, res) => {
    try {
      const rows = await storage.getRowsByPage(req.params.pageId);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch rows" });
    }
  });

  app.get("/api/rows/:id", async (req, res) => {
    try {
      const row = await storage.getRow(req.params.id);
      if (!row) {
        return res.status(404).json({ error: "Row not found" });
      }
      res.json(row);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch row" });
    }
  });

  app.post("/api/rows", async (req, res) => {
    try {
      const data = insertRowSchema.omit({ order: true }).parse(req.body);
      const row = await storage.createRow(data);
      res.status(201).json(row);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create row" });
    }
  });

  app.patch("/api/rows/:id", async (req, res) => {
    try {
      const data = updateRowSchema.parse(req.body);
      const row = await storage.updateRow(req.params.id, data);
      if (!row) {
        return res.status(404).json({ error: "Row not found" });
      }
      res.json(row);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update row" });
    }
  });

  app.delete("/api/rows/:id", async (req, res) => {
    try {
      await storage.deleteRow(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete row" });
    }
  });

  // Images routes
  app.get("/api/rows/:rowId/images", async (req, res) => {
    try {
      const images = await storage.getImagesByRow(req.params.rowId);
      res.json(images);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch images" });
    }
  });

  app.get("/api/images/:id", async (req, res) => {
    try {
      const image = await storage.getImage(req.params.id);
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
      res.json(image);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch image" });
    }
  });

  app.post("/api/images", async (req, res) => {
    try {
      const data = insertImageSchema.omit({ order: true }).parse(req.body);
      const image = await storage.createImage(data);
      res.status(201).json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create image" });
    }
  });

  app.patch("/api/images/:id", async (req, res) => {
    try {
      const data = updateImageSchema.parse(req.body);
      const image = await storage.updateImage(req.params.id, data);
      if (!image) {
        return res.status(404).json({ error: "Image not found" });
      }
      res.json(image);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update image" });
    }
  });

  app.delete("/api/images/:id", async (req, res) => {
    try {
      await storage.deleteImage(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete image" });
    }
  });

  // Share Links routes
  app.post("/api/share-links/:pageId", async (req, res) => {
    try {
      const pageId = req.params.pageId;
      
      // Check if page exists
      const page = await storage.getPage(pageId);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }

      // Check if share link already exists for this page
      const existingLink = await storage.getShareLinkByPageId(pageId);
      if (existingLink) {
        return res.json(existingLink);
      }

      // Generate short code (8 characters)
      const shortCode = randomBytes(4).toString('hex');
      const data = insertShareLinkSchema.parse({ shortCode, pageId });
      const shareLink = await storage.createShareLink(data);
      res.status(201).json(shareLink);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create share link" });
    }
  });

  app.get("/api/share-links/:shortCode", async (req, res) => {
    try {
      const shareLink = await storage.getShareLinkByCode(req.params.shortCode);
      if (!shareLink) {
        return res.status(404).json({ error: "Share link not found" });
      }
      res.json(shareLink);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch share link" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
