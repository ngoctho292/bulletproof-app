'use client';

import { useToast } from '@/components/ui/toast';
import Link from 'next/link';

export default function Home() {
  const toast = useToast();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Bulletproof React App
      </h1>
      <Link
        href="/products"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        View Products
      </Link>
      <span onClick={() => toast({ title: 'Mặc định',description: 'heheh', duration: 2000 })}>Toast default</span>
      <span onClick={() => toast.success({ title: 'Thành công',description: 'heheh', duration: 2000 })}>Toast success</span>
      <span onClick={() => toast.warning({ title: 'Cảnh báo',description: 'heheh', duration: 2000 })}>Toast warning</span>
      <span onClick={() => toast.info({ title: 'Thông tin',description: 'heheh', duration: 2000 })}>Toast info</span>
      <span onClick={() => toast.error({ title: 'Lỗi',description: 'heheh', duration: 2000 })}>Toast error</span>
    </div>
  );
}