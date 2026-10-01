import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { usePrograms } from '@/hooks/use-programs'
import type { Lead } from '@/services/types'
import { LeadForm } from './lead-form'

interface LeadFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (lead: Lead) => void
}

export function LeadFormDialog({ open, onOpenChange, onCreated }: LeadFormDialogProps) {
  const { programs, loading, failed } = usePrograms(open)

  const handleCreated = (lead: Lead) => {
    onOpenChange(false)
    onCreated(lead)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto rounded-2xl border-orange-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-orange-900">Nuevo prospecto</DialogTitle>
          <DialogDescription>
            Registra a una persona interesada en un programa. Quedará en la etapa inicial del pipeline.
          </DialogDescription>
        </DialogHeader>
        {loading && <Skeleton className="h-64 rounded-xl bg-orange-100" />}
        {failed && (
          <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            No pudimos cargar los programas. Cierra e inténtalo de nuevo.
          </p>
        )}
        {!loading && !failed && <LeadForm programs={programs} onCreated={handleCreated} />}
      </DialogContent>
    </Dialog>
  )
}
