import { app } from "@/atoms/kuepa"
import { useEffect, useMemo, useState } from "react"
import { LeadFormDialog } from "@/components/leads/lead-form-dialog"
import { LeadsBoard } from "@/components/leads/leads-board"
import { LeadsBoardError, LeadsBoardSkeleton } from "@/components/leads/leads-board-states"
import { LeadsHeader } from "@/components/leads/leads-header"
import { LeadsStats } from "@/components/leads/leads-stats"
import { useLeadsBoard } from "@/hooks/use-leads-board"
import { filterLeads, groupLeadsByStage, leadStats } from "@/util/lead-pipeline"

export default function Leads () {
  const board = useLeadsBoard()
  const [query, setQuery] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  useEffect(() => {
    app.set({
      ...(app.get() || {}),
      app: 'kuepa',
      module: 'leads',
      window: 'crm',
      back: null,
      accent: 'orange',
      breadcrumb:[
        {
          title: 'Prospectos',
          url: '/leads'
        }
      ]
    })
  }, [])

  const stats = useMemo(
    () => leadStats(groupLeadsByStage(board.leads, board.stages)),
    [board.leads, board.stages]
  )
  const columns = useMemo(
    () => groupLeadsByStage(filterLeads(board.leads, query), board.stages),
    [board.leads, board.stages, query]
  )

  return (
    <div className="flex flex-col gap-5">
      <LeadsHeader query={query} onQueryChange={setQuery} onNew={() => setFormOpen(true)} />
      {!board.failed && !board.loading && <LeadsStats stats={stats} />}
      {board.loading && <LeadsBoardSkeleton />}
      {board.failed && <LeadsBoardError onRetry={board.reload} />}
      {!board.loading && !board.failed && (
        <LeadsBoard columns={columns} movingId={board.movingId} onMove={board.move} />
      )}
      <LeadFormDialog open={formOpen} onOpenChange={setFormOpen} onCreated={board.addLead} />
    </div>
  )
}
