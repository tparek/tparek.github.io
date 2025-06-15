# Invoice Generator Application

## Overview

This is a professional invoice generation system built for Teton Productions OÜ. The application allows users to create invoices with automatic numbering, VAT calculations, and PDF export functionality. It features a modern React frontend with a Node.js/Express backend and PostgreSQL database integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **PDF Generation**: jsPDF for client-side PDF creation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Build System**: Vite for frontend, esbuild for backend bundling

### Database Schema
The application uses two main tables:
- **invoices**: Stores invoice data including recipient details, service items, and calculated totals
- **invoice_counter**: Maintains the current invoice number sequence (starting from 181)

## Key Components

### Invoice Management
- Automatic invoice numbering with counter persistence
- Dynamic service item management (add/remove items)
- Real-time VAT calculation (22% rate)
- Form validation using Zod schemas

### PDF Generation
- Client-side PDF generation with company branding
- Professional invoice formatting with Estonian locale date formatting
- Multi-line address support
- Company details pre-filled for Teton Productions OÜ

### Data Storage
- **Database**: PostgreSQL database with Drizzle ORM
- **Connection**: Neon Database (serverless PostgreSQL)
- Schema validation with Drizzle-Zod integration
- Automatic invoice counter persistence starting from 181

## Data Flow

1. **Invoice Creation Flow**:
   - User fills invoice form with recipient and service details
   - Client validates data using Zod schemas
   - Subtotal, VAT (22%), and total are calculated automatically
   - Data is sent to backend API for persistence
   - Invoice counter is incremented
   - New invoice number is returned for next invoice

2. **PDF Generation Flow**:
   - User clicks "Generate PDF" button
   - Client-side jsPDF generates formatted invoice
   - PDF includes company branding and Estonian formatting
   - PDF is automatically downloaded

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **jspdf**: PDF generation
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

## Deployment Strategy

### Replit Configuration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Development**: `npm run dev` (tsx with hot reload)
- **Production Build**: Vite build + esbuild bundling
- **Port Configuration**: Internal 5000, External 80

### Build Process
1. Frontend built with Vite to `dist/public`
2. Backend bundled with esbuild to `dist/index.js`
3. Static files served from Express in production
4. Database managed via Drizzle migrations

### Environment Requirements
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment flag (development/production)

## Recent Changes
- June 15, 2025: Initial setup with in-memory storage
- June 15, 2025: Added PostgreSQL database integration with Drizzle ORM
  - Replaced MemStorage with DatabaseStorage
  - Invoice counter now persists in database
  - All invoices stored permanently in PostgreSQL

## User Preferences

Preferred communication style: Simple, everyday language.