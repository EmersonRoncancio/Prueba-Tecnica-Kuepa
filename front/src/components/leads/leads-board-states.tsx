import { Skeleton } from '@/components/ui/skeleton'

export function LeadsBoardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando prospectos" className="flex gap-4 overflow-hidden pb-4">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="flex w-72 shrink-0 flex-col gap-3 rounded-xl bg-orange-50/60 p-3">
          <Skeleton className="h-5 w-32 bg-orange-100" />
          <Skeleton className="h-28 rounded-xl bg-orange-100" />
          <Skeleton className="h-28 rounded-xl bg-orange-100" />
        </div>
      ))}
    </div>
  )
}

export function LeadsBoardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-6 py-10 text-center">
      <p className="text-sm font-medium text-red-700">No pudimos cargar los prospectos.</p>
      <button
        onClick={onRetry}
        className="rounded-full bg-orange-500 px-5 py-1.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600"
      >
        Reintentar
      </button>
    </div>
  )
}
