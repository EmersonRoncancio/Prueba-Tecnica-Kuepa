import { useCallback, useEffect, useState } from 'react'
import { toast } from '@/components/hooks/use-toast'
import { leadService } from '@/services/leadService'
import { trackingService } from '@/services/trackingService'
import type { ApiError, Lead, Tracking } from '@/services/types'
import { leadMessage } from '@/util/lead-messages'

const replace = (leads: Lead[], next: Lead) => leads.map((l) => (l._id === next._id ? next : l))

export function useLeadsBoard() {
  const [stages, setStages] = useState<Tracking[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [movingId, setMovingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setFailed(false)
    const [trackings, list] = await Promise.all([trackingService.list(), leadService.list()])
    if (trackings?.list && list?.list) {
      setStages(trackings.list)
      setLeads(list.list)
    } else {
      setFailed(true)
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const addLead = (lead: Lead) => setLeads((prev) => [lead, ...prev])

  const move = async (lead: Lead, trackingId: string) => {
    setMovingId(lead._id)
    const response = await leadService.move({ _id: lead._id, tracking: trackingId })
    setMovingId(null)
    if (response && 'object' in response) {
      setLeads((prev) => replace(prev, response.object))
    } else {
      const error = response as ApiError | undefined
      toast({
        variant: 'destructive',
        title: 'No se pudo mover el prospecto',
        description: leadMessage(error?.message ?? error?.system_message),
      })
    }
  }

  return { stages, leads, loading, failed, movingId, reload: load, addLead, move }
}
