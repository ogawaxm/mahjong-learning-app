import { create } from 'zustand'
import type { SessionState } from '../types'

const STORAGE_KEY_PREFIX = 'mahjong_session_'

interface SessionStore {
  sessions: Record<string, SessionState>
  saveSession: (state: SessionState) => void
  loadSession: (mode: SessionState['mode']) => SessionState | null
}

function persist(state: SessionState): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${state.mode}`, JSON.stringify(state))
  } catch {
    console.warn('セッション状態の保存に失敗しました')
  }
}

function restore(mode: SessionState['mode']): SessionState | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${mode}`)
    return raw ? (JSON.parse(raw) as SessionState) : null
  } catch {
    return null
  }
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessions: {},
  saveSession: (state) => {
    persist(state)
    set((prev) => ({ sessions: { ...prev.sessions, [state.mode]: state } }))
  },
  loadSession: (mode) => {
    const cached = get().sessions[mode]
    if (cached) return cached
    const restored = restore(mode)
    if (restored) {
      set((prev) => ({ sessions: { ...prev.sessions, [mode]: restored } }))
    }
    return restored
  },
}))
