import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'log320-progress'

interface ProgressState {
  /** ids des sections marquées comme lues */
  read: string[]
  /** dernière section visitée */
  lastVisited?: string
}

interface ProgressContextValue {
  isRead: (sectionId: string) => boolean
  toggleRead: (sectionId: string) => void
  markVisited: (sectionId: string) => void
  lastVisited?: string
  readCount: (sectionIds: string[]) => number
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as ProgressState
  } catch {
    // stockage corrompu ou indisponible : repartir à zéro
  }
  return { read: [] }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // quota dépassé ou stockage indisponible : la progression reste en mémoire
    }
  }, [state])

  const value: ProgressContextValue = {
    isRead: (id) => state.read.includes(id),
    toggleRead: (id) =>
      setState((s) => ({
        ...s,
        read: s.read.includes(id) ? s.read.filter((r) => r !== id) : [...s.read, id],
      })),
    markVisited: (id) => setState((s) => (s.lastVisited === id ? s : { ...s, lastVisited: id })),
    lastVisited: state.lastVisited,
    readCount: (ids) => ids.filter((id) => state.read.includes(id)).length,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress doit être utilisé sous <ProgressProvider>')
  return ctx
}
