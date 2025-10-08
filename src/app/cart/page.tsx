'use client';

import { useCartStore } from '@/stores/cart-store';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link
            href="/products"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 flex gap-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2">${item.price}</p>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            
            <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}