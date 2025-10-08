'use client';

import Link from 'next/link';
import { useCartStore } from '@/stores/cart-store';

export function Header() {
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Shop
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/products" className="hover:text-blue-600 transition-colors">
              Products
            </Link>
            <Link href="/kanban" className="hover:text-blue-600 transition-colors">
              Kanban
            </Link>
            <Link href="/login" className="hover:text-blue-600 transition-colors">
              Login
            </Link>
            <Link href="/cart" className="relative hover:text-blue-600 transition-colors">
              🛒 Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}