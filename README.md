# Ticket Generator

A simplified Next.js application for event ticket generation with QR code scanning capabilities. The system uses JSON file storage for simplicity and includes admin authentication via Clerk.

## Features

- **Event Management**: Create and manage events with custom templates
- **Ticket Generation**: Generate tickets with QR codes for entry validation
- **QR Scanning**: Scan tickets at event entry points
- **Admin Authentication**: Secure admin access using Clerk authentication
- **JSON Storage**: Simple file-based storage system (no database required)

## Architecture

- **Frontend**: Next.js 15.5.4 with React 19 and Tailwind CSS
- **Authentication**: Clerk.js for admin access control
- **Storage**: JSON files (events.json, tickets.json, scans.json)
- **QR Codes**: Generated using qrcode library, scanned using jsqr

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Copy `.env.local.example` to `.env.local` and configure your Clerk credentials:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_ALLOWED_EMAIL=admin@example.com
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Data Storage

The application stores all data in JSON files in the root directory:

- `events.json` - Event definitions and template configurations
- `tickets.json` - Issued tickets and entry records (created when first ticket is issued)
- `scans.json` - Scan history and entry logs

## Admin Access

Only users with the configured email address can access the admin dashboard. Configure the allowed admin email in your environment variables.

## Build and Deploy

```bash
npm run build
npm run start
```

The application can be deployed to any Node.js hosting platform that supports Next.js.
