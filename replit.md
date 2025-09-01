# FeminaFit - Women's Fitness Platform

## Overview

FeminaFit is a full-stack fitness platform designed exclusively for women, featuring a modern web application with membership management, class scheduling, e-commerce capabilities, and payment processing. The platform creates a supportive sisterhood community for women's fitness and wellness, offering gym memberships, fitness classes, product sales, and content management in a women-only environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **State Management**: Zustand for client-side state (shopping cart) and TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Radix UI components with Tailwind CSS for consistent, accessible design
- **Form Handling**: React Hook Form with Zod validation for robust form management
- **Styling**: Tailwind CSS with CSS variables for theming, custom gradients, and responsive design

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with OpenID Connect strategy for Replit authentication
- **Session Management**: Express sessions with PostgreSQL storage using connect-pg-simple
- **API Design**: RESTful API endpoints with comprehensive error handling and request logging

### Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM with schema definitions in TypeScript
- **Session Storage**: PostgreSQL sessions table for persistent user sessions
- **Database Schema**: Comprehensive schema including users, pages, testimonials, fitness classes, schedules, membership plans, products, orders, payments, and newsletter subscriptions

### Authentication and Authorization
- **Strategy**: OpenID Connect integration with Replit's authentication system
- **Session Management**: Server-side sessions with secure cookie configuration
- **Route Protection**: Middleware-based authentication checks for protected endpoints
- **User Management**: Complete user profile management with role-based access

### Build and Development
- **Build Tool**: Vite for fast development and optimized production builds
- **Development**: Hot module replacement and runtime error overlay for enhanced developer experience
- **TypeScript**: Strict type checking across the entire application
- **Path Aliases**: Configured aliases for clean imports (@/, @shared/, @assets/)

## External Dependencies

### Payment Processing
- **M-Pesa Integration**: Safaricom M-Pesa STK Push API for mobile money payments
- **Payment Service**: Custom service handling payment validation and callback processing

### Email Services
- **Email Service**: Configurable email service for transactional emails (welcome, confirmations)
- **Templates**: HTML email templates for user communications

### Database and Hosting
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Replit Integration**: Development environment integration with authentication and deployment

### UI and Styling
- **Radix UI**: Comprehensive accessible component library
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide Icons**: Consistent icon library throughout the application

### Development Tools
- **ESBuild**: Fast bundling for server-side code
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Drizzle Kit**: Database migration and schema management tools