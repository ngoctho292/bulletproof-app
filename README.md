# Bulletproof App

Ứng dụng quản lý toàn diện được xây dựng với Next.js 15, React 19 và TypeScript. Dự án tích hợp đầy đủ các tính năng: Xác thực, Kanban Board, Workflow Builder, Quản lý sản phẩm và Giỏ hàng.

## 🚀 Tech Stack

### Core Framework
- **Next.js 15.5.4** - React Framework với App Router
- **React 19.1.0** - React 19 với React Compiler
- **TypeScript 5** - Type-safe development

### UI & Styling
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI components
  - Dialog, Dropdown Menu, Popover, Toast, Icons
- **Lucide React 0.545.0** - Icon library
- **class-variance-authority** - CSS utility class management
- **tailwindcss-animate** - Animation utilities

### State Management
- **Zustand 5.0.8** - Lightweight state management
  - Auth Store
  - Cart Store  
  - Kanban Store
  - Workflow Store

### Data Fetching & API
- **TanStack Query 5.90.2** (React Query) - Server state management
- **Axios 1.12.2** - HTTP client

### Form & Validation
- **React Hook Form 7.64.0** - Performant form handling
- **Zod 4.1.12** - Schema validation
- **@hookform/resolvers 5.2.2** - Form validation resolver

### Drag & Drop
- **@dnd-kit** - Modern drag and drop toolkit
  - Core 6.3.1
  - Sortable 10.0.0
  - Utilities 3.2.2

### Workflow & Visualization
- **ReactFlow 11.11.4** - Node-based workflow builder

### Utilities
- **dayjs 1.11.18** - Date manipulation
- **clsx & tailwind-merge** - Class name utilities
- **react-error-boundary 6.0.0** - Error handling

## 📁 Cấu Trúc Dự Án

```
bulletproof-app/
├── public/                      # Static assets
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── globals.css         # Global styles
│   │   ├── api/                # API routes
│   │   │   └── send-email/     # Email API endpoint
│   │   ├── login/              # Login page
│   │   ├── products/           # Products page
│   │   ├── cart/               # Shopping cart page
│   │   ├── kanban/             # Kanban board page
│   │   ├── workflow/           # Workflow builder page
│   │   └── chat/               # Chat page
│   │
│   ├── components/             # Shared components
│   │   ├── layouts/            # Layout components
│   │   │   ├── header.tsx
│   │   │   └── sidebar-layout.tsx
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── toast.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── client-date.tsx
│   │   ├── icons/              # Icon components
│   │   └── error-boundary.tsx
│   │
│   ├── features/               # Feature modules
│   │   ├── auth/              # Authentication
│   │   │   ├── api/           # Auth API calls
│   │   │   ├── components/    # Auth components
│   │   │   └── types/         # Auth types
│   │   │
│   │   ├── products/          # Product management
│   │   │   ├── api/           # Product API
│   │   │   ├── components/    # Product components
│   │   │   └── types/         # Product types
│   │   │
│   │   ├── kanban/            # Kanban board
│   │   │   ├── components/    # Board, Column, Card components
│   │   │   ├── stores/        # Kanban Zustand store
│   │   │   └── types/         # Kanban types
│   │   │
│   │   └── workflow/          # Workflow builder
│   │       ├── components/    # Workflow components
│   │       │   └── nodes/     # Custom node types
│   │       ├── stores/        # Workflow store
│   │       ├── templates/     # Workflow templates
│   │       ├── types/         # Workflow types
│   │       └── utils/         # Workflow utilities
│   │
│   ├── lib/                   # Libraries & utilities
│   │   ├── api-client.ts     # Axios instance
│   │   ├── react-query.tsx   # React Query setup
│   │   └── utils.ts          # Utility functions
│   │
│   ├── stores/               # Global Zustand stores
│   │   ├── auth-store.ts
│   │   └── cart-store.ts
│   │
│   ├── types/                # Global TypeScript types
│   │   └── api.ts
│   │
│   ├── config/               # Configuration
│   │   └── env.ts           # Environment variables
│   │
│   └── styles/              # Additional styles
│       └── toast.css
│
├── next.config.ts           # Next.js configuration
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies

```

## 🎯 Tính Năng Chính

### 1. Authentication
- Form đăng nhập với validation
- Quản lý trạng thái auth với Zustand
- Protected routes

### 2. Kanban Board
- Tạo và quản lý boards
- Drag & drop columns và tasks
- Assign tasks cho members
- Real-time updates

### 3. Workflow Builder
- Visual workflow editor với ReactFlow
- Custom node types (Trigger, Action, Condition, Delay, Notification)
- Import/Export workflows
- Workflow execution engine

### 4. Product Management
- Product listing với pagination
- Product cards với skeleton loading
- React Query cho data fetching

### 5. Shopping Cart
- Add/Remove products
- Cart state với Zustand
- Persistent cart

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm hoặc bun

### Installation

```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Run development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

### Build for Production

```bash
# Build application
npm run build

# Start production server
npm run start
```

## 📝 Code Organization

### Feature-Based Architecture
Dự án sử dụng kiến trúc feature-based, mỗi feature độc lập với:
- API calls
- Components
- Types/Interfaces
- Store (nếu cần)

### Component Structure
- `components/ui` - Reusable UI components
- `components/layouts` - Layout components
- `features/*/components` - Feature-specific components

### State Management
- **Zustand** cho client state (auth, cart, kanban, workflow)
- **React Query** cho server state (products, API data)

### Styling Strategy
- Tailwind CSS cho utility classes
- Radix UI cho accessible components
- CSS modules cho custom styles

## 🚀 Deploy

### Vercel (Recommended)
Deploy dễ dàng trên [Vercel Platform](https://vercel.com/new):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
Dự án có thể deploy trên bất kỳ platform nào hỗ trợ Next.js:
- Netlify
- AWS Amplify
- Digital Ocean
- Railway

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Zustand](https://docs.pmnd.rs/zustand)
- [TanStack Query](https://tanstack.com/query)
- [Radix UI](https://www.radix-ui.com)

## 📄 License

This project is private and proprietary.
