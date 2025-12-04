# Gallery Manager - Spotify Style

## Overview

A Spotify-inspired multi-page image gallery manager featuring horizontal scrolling rows, lightbox viewing, and smooth transitions. The application provides an immersive, dark-themed interface for organizing and displaying image collections across multiple pages with horizontal scroll rows.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Client-side routing using Wouter (lightweight alternative to React Router)

**UI Component System**
- shadcn/ui component library with Radix UI primitives for accessible, composable components
- Tailwind CSS for utility-first styling with custom design tokens
- Dark mode support with theme toggle functionality
- Custom color system using HSL values with CSS variables for consistent theming

**Design Philosophy**
- Spotify-inspired horizontal scrolling interface
- Dark, immersive design that prioritizes visual content
- Smooth transitions and fluid animations throughout
- Touch-friendly interactions for cross-device compatibility
- Typography system using Inter font family with defined type scales
- Responsive grid system adapting from 2-3 items on mobile to 4-6 items on desktop

**State Management**
- TanStack Query (React Query) for server state management and caching
- React hooks for local component state
- Optimistic updates for responsive user interactions

**Image Gallery Features**
- LightGallery integration for full-screen lightbox viewing with zoom and thumbnail support
- Horizontal scroll rows with smooth scrolling and navigation arrows
- Drag-to-scroll functionality for enhanced user interaction
- Image metadata display (title and subtitle)

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- TypeScript for type safety across the full stack
- Session-based architecture with express-session (prepared for authentication)

**API Design**
- RESTful API structure with resource-based endpoints
- Three-tier hierarchy: Pages → Rows → Images
- CRUD operations for all resource types
- Validation using Zod schemas

**Data Layer**
- Currently using in-memory storage implementation (MemStorage)
- Drizzle ORM configured for PostgreSQL migration
- Schema designed with cascading deletes for referential integrity
- Order fields for manual sorting of pages, rows, and images

**Storage Strategy**
The application uses a storage abstraction layer (IStorage interface) allowing easy switching between:
- In-memory storage (current implementation with sample data)
- PostgreSQL database (schema and configuration ready via Drizzle ORM)

**Database Schema Design**
- `users` table: Basic authentication structure (username/password)
- `pages` table: Top-level gallery pages with ordering
- `rows` table: Horizontal scroll sections within pages (foreign key to pages)
- `images` table: Individual images within rows (foreign key to rows)
- Cascading deletes ensure data integrity when removing pages or rows

### External Dependencies

**Core Frontend Libraries**
- React 18+ with TypeScript for component architecture
- TanStack Query v5 for data fetching and caching
- Wouter for lightweight client-side routing
- date-fns for date manipulation

**UI Component Libraries**
- Radix UI primitives (18+ component packages) for accessible headless components
- shadcn/ui component system built on Radix
- LightGallery with thumbnail and zoom plugins for image viewing
- Embla Carousel for potential carousel functionality
- Lucide React for icon system

**Styling & Design**
- Tailwind CSS with PostCSS for utility-first styling
- class-variance-authority for component variant management
- clsx and tailwind-merge for conditional class composition
- Custom theme system supporting light/dark modes

**Backend Dependencies**
- Express.js for HTTP server
- express-session with connect-pg-simple for session storage
- Drizzle ORM with @neondatabase/serverless for PostgreSQL
- Zod for runtime validation and schema definition
- drizzle-zod for automatic schema generation from database models

**Database & ORM**
- Drizzle ORM configured for PostgreSQL
- Neon serverless PostgreSQL driver
- Migration system via drizzle-kit
- Type-safe database queries with full TypeScript support

**Development Tools**
- tsx for TypeScript execution in development
- esbuild for production builds
- Vite plugins for Replit integration (dev banner, cartographer, runtime error overlay)

**Form Handling**
- React Hook Form with @hookform/resolvers for form state management
- Zod integration for form validation