interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`rounded-lg bg-gray-800 skeleton-pulse ${className}`}
    />
  )
}

export function KpiSkeleton() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <Skeleton className="h-5 w-48 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
