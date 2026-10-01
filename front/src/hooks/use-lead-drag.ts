import { DragEvent, useState } from 'react'
import type { Lead } from '@/services/types'
import type { StageColumn } from '@/util/lead-pipeline'

/** Native HTML5 drag and drop: the lead _id travels in `dataTransfer`. */
export function useLeadDrag(
  columns: StageColumn[],
  onMove: (lead: Lead, trackingId: string) => void
) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overStageId, setOverStageId] = useState<string | null>(null)

  const reset = () => {
    setDraggingId(null)
    setOverStageId(null)
  }

  const cardProps = (lead: Lead) => ({
    draggable: true,
    onDragStart: (e: DragEvent) => {
      e.dataTransfer.setData('text/plain', lead._id)
      e.dataTransfer.effectAllowed = 'move'
      setDraggingId(lead._id)
    },
    onDragEnd: reset,
  })

  const columnProps = (stageId: string) => ({
    onDragOver: (e: DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setOverStageId(stageId)
    },
    onDragLeave: (e: DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOverStageId(null)
    },
    onDrop: (e: DragEvent) => {
      e.preventDefault()
      const id = e.dataTransfer.getData('text/plain')
      reset()
      const source = columns.find((c) => c.leads.some((l) => l._id === id))
      const lead = source?.leads.find((l) => l._id === id)
      if (!source || !lead || source.stage._id === stageId) return
      onMove(lead, stageId)
    },
  })

  return { draggingId, overStageId, cardProps, columnProps }
}
