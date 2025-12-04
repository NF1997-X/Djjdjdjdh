import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const pages = pgTable("pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  order: integer("order").notNull().default(0),
});

export const rows = pgTable("rows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pageId: varchar("page_id").notNull().references(() => pages.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  order: integer("order").notNull().default(0),
});

export const images = pgTable("images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rowId: varchar("row_id").notNull().references(() => rows.id, { onDelete: 'cascade' }),
  url: text("url").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  order: integer("order").notNull().default(0),
});

export const shareLinks = pgTable("share_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shortCode: varchar("short_code", { length: 8 }).notNull().unique(),
  pageId: varchar("page_id").notNull().references(() => pages.id, { onDelete: 'cascade' }),
  createdAt: integer("created_at").notNull().default(sql`extract(epoch from now())`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPageSchema = createInsertSchema(pages).omit({ id: true });
export const insertRowSchema = createInsertSchema(rows).omit({ id: true });
export const insertImageSchema = createInsertSchema(images).omit({ id: true });
export const insertShareLinkSchema = createInsertSchema(shareLinks).omit({ id: true, createdAt: true });

export const updatePageSchema = insertPageSchema.partial().omit({ order: true });
export const updateRowSchema = insertRowSchema.partial().pick({ title: true });
export const updateImageSchema = insertImageSchema.partial().pick({ url: true, title: true, subtitle: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Page = typeof pages.$inferSelect;
export type Row = typeof rows.$inferSelect;
export type GalleryImage = typeof images.$inferSelect;
export type ShareLink = typeof shareLinks.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;
export type InsertRow = z.infer<typeof insertRowSchema>;
export type InsertImage = z.infer<typeof insertImageSchema>;
export type InsertShareLink = z.infer<typeof insertShareLinkSchema>;
export type UpdatePage = z.infer<typeof updatePageSchema>;
export type UpdateRow = z.infer<typeof updateRowSchema>;
export type UpdateImage = z.infer<typeof updateImageSchema>;
