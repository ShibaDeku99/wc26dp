import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  type?: 'card' | 'table' | 'list' | 'hero' | 'match';
  count?: number;
}

export function LoadingSkeleton({ type = 'card', count = 3 }: LoadingSkeletonProps) {
  if (type === 'hero') {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-10 w-3/4 rounded-xl bg-slate-100 dark:bg-white/5" />
        <Skeleton className="h-6 w-1/2 rounded-lg bg-slate-100 dark:bg-white/5" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl bg-slate-100 dark:bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'match') {
    return (
      <div className="space-y-3">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full bg-slate-200 dark:bg-white/10" />
                <Skeleton className="h-4 w-24 rounded bg-slate-200 dark:bg-white/10" />
              </div>
              <Skeleton className="h-6 w-12 rounded bg-slate-200 dark:bg-white/10" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-24 rounded bg-slate-200 dark:bg-white/10" />
                <Skeleton className="h-8 w-8 rounded-full bg-slate-200 dark:bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="space-y-2 p-4">
        <Skeleton className="h-10 w-full rounded-lg bg-slate-100 dark:bg-white/5" />
        {[...Array(count)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg bg-slate-100 dark:bg-white/5" />
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3 p-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/5" />
            <Skeleton className="h-4 w-full rounded bg-slate-100 dark:bg-white/5" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="h-48 rounded-2xl bg-slate-100 dark:bg-white/5" />
      ))}
    </div>
  );
}
