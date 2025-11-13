'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  ShoppingBag, 
  ShoppingCart, 
  KanbanSquareDashed, 
  GitBranch, 
  MessageSquare, 
  LogIn,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';

interface SidebarLayoutProps {
  children: ReactNode;
}

const navItems = [
  { 
    name: 'Home', 
    href: '/', 
    icon: Home 
  },
  { 
    name: 'Tasks', 
    href: '/tasks', 
    icon: ShoppingBag 
  },
  { 
    name: 'Products', 
    href: '/products', 
    icon: ShoppingBag 
  },
  { 
    name: 'Kanban', 
    href: '/kanban', 
    icon: KanbanSquareDashed 
  },
  { 
    name: 'Workflow', 
    href: '/workflow', 
    icon: GitBranch 
  },
  { 
    name: 'Chat', 
    href: '/chat', 
    icon: MessageSquare 
  },
  { 
    name: 'Login', 
    href: '/login', 
    icon: LogIn 
  },
  { 
    name: 'Cart', 
    href: '/cart', 
    icon: ShoppingCart 
  },
];

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Overlay cho mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          bg-white border-r border-gray-200 
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-20'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo & Toggle */}
        <div className={`
          h-16 border-b border-gray-200 flex items-center justify-between px-4
          ${!isExpanded && 'justify-center'}
        `}>
          {isExpanded ? (
            <>
              <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
                MyApp
              </Link>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
              >
                <ChevronLeft size={20} className="text-gray-600" />
              </button>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsExpanded(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const isCart = item.name === 'Cart';
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-lg
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600 font-semibold' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                      ${!isExpanded && 'justify-center'}
                      relative group
                    `}
                  >
                    <div className="relative flex-shrink-0">
                      <Icon size={20} />
                      {isCart && itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                          {itemCount}
                        </span>
                      )}
                    </div>
                    
                    {isExpanded && (
                      <span className="flex-1">{item.name}</span>
                    )}

                    {/* Tooltip cho collapsed state */}
                    {!isExpanded && (
                      <div className="
                        absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg
                        opacity-0 invisible group-hover:opacity-100 group-hover:visible
                        transition-all duration-200 whitespace-nowrap z-50
                      ">
                        {item.name}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900" />
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className={`
          border-t border-gray-200 p-4
          ${!isExpanded && 'flex justify-center'}
        `}>
          <div className={`flex items-center gap-3 ${!isExpanded && 'flex-col'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              U
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">User Name</p>
                <p className="text-xs text-gray-500 truncate">user@example.com</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header - Chỉ hiện menu button trên mobile */}
        <header className="h-16 bg-white dark:bg-gray-900 dark:text-gray-50 border-b border-gray-200 flex items-center px-4 lg:px-6">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden mr-3"
          >
            <Menu size={24} className="text-gray-600" />
          </button>
          
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-800">
              {navItems.find(item => item.href === pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          {/* User avatar trên mobile */}
          <div className="lg:hidden">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
              U
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}