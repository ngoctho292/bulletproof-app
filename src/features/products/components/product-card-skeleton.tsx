import { Skeleton } from '@/components/ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg p-4">
      <Skeleton className="h-48 mb-4" />
      <Skeleton className="h-6 mb-2" />
      <Skeleton className="h-4 mb-2" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}