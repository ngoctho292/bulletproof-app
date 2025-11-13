'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTaskStore } from '@/features/tasks/stores/task-store';

export default function Home() {
  const router = useRouter();
  const { token } = useTaskStore();

  useEffect(() => {
    // Redirect to /tasks if logged in, otherwise to /login-v2
    if (token) {
      router.push('/tasks');
    } else {
      router.push('/login-v2');
    }
  }, [token, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang chuyển hướng...</p>
      </div>
    </div>
  );
}