# GEMINI.md - Daily Flow Project Context

## Project Overview

**Daily Flow** is a web application built using Next.js (App Router). It serves as a dashboard/task management application designed to handle daily workflows with user authentication and real-time database capabilities. 

### Core Technologies
- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript
- **Styling:** Tailwind CSS (with `tailwindcss-animate`)
- **UI Components:** 
  - Custom base components (`src/components/ui`)
  - [Radix UI](https://www.radix-ui.com/) primitives
  - [Framer Motion](https://www.framer.com/motion/) for animations
  - [Lucide React](https://lucide.dev/) for iconography
- **Backend / BaaS:** Firebase (Authentication and Firestore)
- **State Management:** React Context (`AuthContext`) and Custom Hooks (`useTasks`)
- **Theme:** `next-themes` (Dark/Light mode support)
- **Utilities:** `date-fns`, `clsx`, `tailwind-merge`

## Architecture & Directory Structure

The project follows a standard Next.js App Router directory structure inside a `src/` folder:

- `src/app/`: Contains the Next.js routes.
  - `/` (Home): Entry point, acts as a redirect to either `/login` or `/dashboard` based on authentication status.
  - `/login`: User authentication page.
  - `/dashboard`: Main authenticated user view.
- `src/components/`: Reusable React components.
  - Core components like `Sidebar`, `TaskCard`, `AuthGuard`, etc.
  - `src/components/ui/`: Contains low-level, reusable UI primitives (e.g., `button`, `card`, `input`).
- `src/config/`: Configuration files (e.g., `firebaseConfig.js` for Firebase initialization).
- `src/context/`: React context providers (e.g., `AuthContext.js` for global auth state).
- `src/hooks/`: Custom React hooks (e.g., `useTasks.js` for fetching/managing data).
- `src/lib/`: General utility functions (e.g., `utils.js` for Tailwind class merging).

## Building and Running

The project relies on Node.js and NPM/Yarn. Standard Next.js scripts are defined in the `package.json`:

```bash
# Install dependencies
npm install

# Start the development server (localhost:3000)
npm run dev

# Build the application for production
npm run build

# Start the production server
npm run start

# Run ESLint to check for code quality issues
npm run lint
```

## Development Conventions

1. **Routing:** Uses the Next.js App Router (`app` directory paradigm). Server and Client Components are mixed appropriately (e.g., using `"use client"` directives in interactive components).
2. **Styling:** Fully relies on Tailwind CSS for styling. Utility classes are combined using `clsx` and `tailwind-merge` in the `lib/utils.js` function to ensure clean and conflict-free class merging.
3. **Environment Variables:** Requires a set of Firebase-specific environment variables in a `.env.local` file (see `.env.local.example` for the required keys).
4. **Authentication:** Protected routes (like `/dashboard`) should be wrapped or checked against the `AuthContext` (or using `AuthGuard`) to prevent unauthorized access.
5. **Data Fetching:** Data fetching and side effects related to Firebase are encapsulated inside custom hooks (`src/hooks/useTasks.js`) to keep components clean.
