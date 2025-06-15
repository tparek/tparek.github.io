import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInvoiceSchema, type ServiceItem } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get next invoice number
  app.get("/api/invoice-number", async (req, res) => {
    try {
      const nextNumber = await storage.getNextInvoiceNumber();
      res.json({ nextInvoiceNumber: nextNumber });
    } catch (error) {
      res.status(500).json({ message: "Failed to get next invoice number" });
    }
  });

  // Create new invoice
  app.post("/api/invoices", async (req, res) => {
    try {
      const validatedData = insertInvoiceSchema.parse(req.body);
      
      // Calculate totals
      const serviceItems = validatedData.serviceItems as ServiceItem[];
      const subtotal = serviceItems.reduce((sum, item) => sum + (item.amount * item.price), 0);
      const vat = subtotal * 0.22;
      const total = subtotal + vat;

      const invoiceData = {
        ...validatedData,
        subtotal: subtotal.toFixed(2),
        vat: vat.toFixed(2),
        total: total.toFixed(2),
      };

      const invoice = await storage.createInvoice(invoiceData);
      const nextNumber = await storage.getNextInvoiceNumber();
      
      res.json({ 
        invoice,
        nextInvoiceNumber: nextNumber
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation failed", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ message: "Failed to create invoice" });
      }
    }
  });

  // Get all invoices
  app.get("/api/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ message: "Failed to get invoices" });
    }
  });

  // Get specific invoice
  app.get("/api/invoices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const invoice = await storage.getInvoice(id);
      
      if (!invoice) {
        res.status(404).json({ message: "Invoice not found" });
        return;
      }
      
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ message: "Failed to get invoice" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
