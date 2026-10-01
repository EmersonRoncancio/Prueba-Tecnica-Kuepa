import { Plus, Search } from 'lucide-react'

interface LeadsHeaderProps {
  query: string
  onQueryChange: (query: string) => void
  onNew: () => void
}

export function LeadsHeader({ query, onQueryChange, onNew }: LeadsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-400 bg-clip-text text-3xl font-extrabold leading-tight text-transparent">
          Prospectos
        </h1>
        <p className="text-sm text-muted-foreground">
          Sigue a cada persona interesada, desde el primer contacto hasta la matrícula.
        </p>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />
          <input
            type="search"
            aria-label="Buscar prospectos"
            placeholder="Buscar por nombre, correo o programa"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="h-10 w-full rounded-full border border-orange-100 bg-orange-100 pl-9 pr-4 text-sm outline-none transition-all focus:border-orange-200 focus:shadow-md sm:w-72"
          />
        </div>
        <button
          onClick={onNew}
          className="flex h-10 items-center justify-center gap-2 rounded-full bg-orange-500 px-5 text-sm font-semibold text-white shadow-md transition-all hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          Nuevo prospecto
        </button>
      </div>
    </div>
  )
}
