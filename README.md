# TODO List Application

A modern, responsive TODO list application built with Vue 3, TypeScript, and Tailwind CSS. Features a clean UI with dark/light mode support, toast notifications, and category-based task organization.

## 🚀 Features

- ✅ **Task Management**: Create, edit, delete, and mark tasks as complete
- 🏷️ **Categories**: Organize tasks by categories (Work, Lifestyle, Personal, Health, Learning)
- 🔔 **Toast Notifications**: User feedback with shadcn toast components
- 📱 **Responsive Design**: Mobile-first approach with Tailwind CSS
- 🎨 **Modern UI**: Clean interface with class-variance-authority for component variants

## 🛠️ Tech Stack

- **Frontend**: Vue 3 (Composition API), TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **UI Components**: Custom components and shadcn premade components
- **Icons**: Lucide Vue Next
- **Build Tool**: Vite
- **Backend**: Laravel API (separate repository)

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (version 16+)
- Laravel API: Clone from https://github.com/Orekidesu/todo_api

## ⚡ Quick Start

1. **Install dependencies**

   ```sh
   npm install
   ```

2. **Environment Setup**

   ```sh
   cp .env.development .env
   # Update VITE_API_BASE_URL if needed (default: http://127.0.0.1:8000/api/v1)
   ```

3. **Start development server**

   ```sh
   npm run dev
   ```

4. **Open your browser** at `http://localhost:5173`

## 📁 Project Structure

```
todo-list/
├── public/                 # Static assets
│   ├── favicon.svg        # Application favicon
│   └── ...
├── src/
│   ├── components/
│   │   ├── dashboard/     # Dashboard-specific components
│   │   │   ├── CategoryManager.vue      # Category CRUD operations
│   │   │   ├── DashboardHeader.vue      # Header with theme toggle
│   │   │   ├── DashboardTitle.vue       # Page title with action buttons
│   │   │   ├── EmptyState.vue          # No tasks placeholder
│   │   │   ├── NoResults.vue           # No search results state
│   │   │   ├── StatsCards.vue          # Task statistics cards
│   │   │   ├── TaskFilters.vue         # Search and filter controls
│   │   │   ├── TaskGrid.vue            # Task cards with drag & drop
│   │   │   └── TaskModal.vue           # Task create/edit modal
│   │   └── ui/            # Reusable UI components
│   │       ├── button/    # Button component variants
│   │       ├── dialog/    # Modal dialog components
│   │       ├── input/     # Form input components
│   │       ├── select/    # Dropdown select components
│   │       └── toast/     # Notification components
│   ├── composables/       # Vue composition functions
│   │   ├── useAuth.ts     # Authentication logic
│   │   └── ...
│   ├── data/
│   │   └── dummyData.ts   # Sample tasks & categories data
│   ├── lib/
│   │   └── utils.ts       # Utility functions (cn, clsx)
│   ├── services/
│   │   └── taskApi.ts     # API service layer
│   ├── views/
│   │   └── dashboard/
│   │       └── DashboardView.vue  # Main dashboard page
│   ├── style.css          # Global styles & CSS custom properties
│   └── main.ts            # Application entry point
├── .env                   # Environment variables (not in repo)
├── .env.development       # Development environment config
├── .gitignore            # Git ignore rules
├── eslint.config.ts      # ESLint configuration
├── index.html            # HTML entry point
├── package.json          # Dependencies & scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite build configuration
└── README.md             # Project documentation
```

### Key Directories Explained

- **`src/components/dashboard/`** - All dashboard-specific Vue components including task management, statistics, and filtering
- **`src/components/ui/`** - Reusable UI components following shadcn/ui patterns with TypeScript variants
- **`src/composables/`** - Vue 3 composition functions for shared logic (auth, API calls, etc.)
- **`src/services/`** - API service layer for backend communication
- **`src/views/`** - Page-level Vue components (router views)
- **`src/lib/`** - Utility functions and shared TypeScript helpers

## 🔧 Available Scripts

```sh
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## 🌐 Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1 (the most important part, the rest are just add ons)
VITE_APP_NAME=TODO List App
VITE_APP_ENV=development
VITE_API_VERSION=v1
VITE_ENABLE_DEBUG=true
```

## 🎯 API Integration

The app is configured to work with a Laravel backend API. Ensure the Laravel API is running on the configured URL before starting the frontend.

## 🔧 IDE Setup

**Recommended**: [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

⚠️ **Important**: Disable Vetur extension if installed to avoid conflicts.

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
