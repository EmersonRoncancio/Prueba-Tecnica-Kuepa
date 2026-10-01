import { useEffect, useState } from 'react'
import { programService } from '@/services/programService'
import type { Program } from '@/services/types'

/** Loads the program catalogue once `enabled` is true. */
export function usePrograms(enabled = true) {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!enabled || programs.length) return
    let active = true
    setLoading(true)
    setFailed(false)
    programService.list().then((response) => {
      if (!active) return
      if (response?.list) setPrograms(response.list)
      else setFailed(true)
      setLoading(false)
    })
    return () => { active = false }
  }, [enabled])

  return { programs, loading, failed }
}
