'use client';

import Image from 'next/image';
import { Product } from '../types';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/stores/cart-store';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div
      className={cn(
        'border rounded-lg p-4 hover:shadow-lg transition-shadow flex flex-col',
        className
      )}
    >
      <div className="relative h-48 mb-4">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain"
        />
      </div>
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
        {product.title}
      </h3>
      <p className="text-gray-600 text-sm mb-2 line-clamp-2 flex-grow">
        {product.description}
      </p>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xl font-bold">${product.price}</span>
        <span className="text-sm text-gray-500">
          ⭐ {product.rating.rate} ({product.rating.count})
        </span>
      </div>
      <button
        onClick={handleAddToCart}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add to Cart
      </button>
    </div>
  );
}