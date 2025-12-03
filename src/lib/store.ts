import { create } from 'zustand'
import { Language } from './i18n'

interface AppState {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useAppStore = create<AppState>((set) => ({
  language: 'fr',
  setLanguage: (lang) => set({ language: lang }),
}))

