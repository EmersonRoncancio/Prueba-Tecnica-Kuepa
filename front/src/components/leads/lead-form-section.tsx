import { ReactNode } from 'react'

export function LeadFormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-3 rounded-xl border border-orange-100 p-4">
      <legend className="px-2 text-xs font-semibold uppercase tracking-wide text-orange-700">{title}</legend>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}
