import { users, invoices, invoiceCounter, type User, type InsertUser, type Invoice, type InsertInvoice, type InvoiceCounter } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Invoice operations
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  getInvoices(): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  
  // Invoice counter operations
  getNextInvoiceNumber(): Promise<number>;
  incrementInvoiceNumber(): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createInvoice(insertInvoice: InsertInvoice): Promise<Invoice> {
    // Get next invoice number
    const nextInvoiceNumber = await this.getNextInvoiceNumber();
    
    // Create invoice with next number
    const invoiceData = {
      ...insertInvoice,
      invoiceNumber: nextInvoiceNumber,
      serviceItems: JSON.stringify(insertInvoice.serviceItems),
      recipientVatNumber: insertInvoice.recipientVatNumber || null,
    };
    
    const [invoice] = await db
      .insert(invoices)
      .values(invoiceData)
      .returning();
    
    // Increment counter after successful creation
    await this.incrementInvoiceNumber();
    
    return invoice;
  }

  async getInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices).orderBy(desc(invoices.id));
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await db.select().from(invoices).where(eq(invoices.id, id));
    return invoice || undefined;
  }

  async getNextInvoiceNumber(): Promise<number> {
    // Initialize counter if it doesn't exist
    const [counter] = await db.select().from(invoiceCounter).limit(1);
    
    if (!counter) {
      await db.insert(invoiceCounter).values({ currentNumber: 181 });
      return 181;
    }
    
    return counter.currentNumber;
  }

  async incrementInvoiceNumber(): Promise<number> {
    // Get current counter
    const [counter] = await db.select().from(invoiceCounter).limit(1);
    
    if (!counter) {
      // Initialize if doesn't exist
      await db.insert(invoiceCounter).values({ currentNumber: 182 });
      return 182;
    } else {
      // Update existing counter
      const newNumber = counter.currentNumber + 1;
      await db.update(invoiceCounter)
        .set({ currentNumber: newNumber })
        .where(eq(invoiceCounter.id, counter.id));
      return newNumber;
    }
  }
}

export const storage = new DatabaseStorage();
