import { pgTable, text, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: integer("invoice_number").notNull(),
  invoiceDate: text("invoice_date").notNull(),
  paymentTerm: text("payment_term").notNull(),
  recipientCompanyName: text("recipient_company_name").notNull(),
  recipientAddress: text("recipient_address").notNull(),
  recipientRegNumber: text("recipient_reg_number").notNull(),
  recipientVatNumber: text("recipient_vat_number"),
  serviceItems: text("service_items").notNull(), // JSON string
  subtotal: decimal("subtotal").notNull(),
  vat: decimal("vat").notNull(),
  total: decimal("total").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invoiceCounter = pgTable("invoice_counter", {
  id: serial("id").primaryKey(),
  currentNumber: integer("current_number").notNull().default(181),
});

export const serviceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.number().min(1, "Amount must be at least 1"),
  price: z.number().min(0, "Price must be positive"),
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
}).extend({
  serviceItems: z.array(serviceItemSchema).min(1, "At least one service item is required"),
});

export type ServiceItem = z.infer<typeof serviceItemSchema>;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;
export type InvoiceCounter = typeof invoiceCounter.$inferSelect;

// Users table (keeping existing for compatibility)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
