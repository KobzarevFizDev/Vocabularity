import { create } from 'zustand'
import type { WordDto } from '../api'

interface WordsStore {
    candidateWords: WordDto[]
    needToAdd: string[]
    needToDelete: string[]

    suggestCandidates: (words: WordDto[]) => void
    clearCandidates: () => void
    removeCandidates: (ids: string[]) => void
    toggleNeedToAdd: (id: string) => void
    toggleNeedToDelete: (id: string) => void
    clearNeedToAdd: () => void
    clearNeedToDelete: () => void
}

export const useWordStore = create<WordsStore>((set) => ({
    candidateWords: [],
    needToAdd: [],
    needToDelete: [],

    suggestCandidates: (words: WordDto[]) => set((state) => ({
        candidateWords: [...state.candidateWords, ...words]
    })),

    clearCandidates: () => set({ candidateWords: [] }),

    removeCandidates: (ids: string[]) => set((state) => ({
        candidateWords: state.candidateWords.filter(w => !ids.includes(w.id))
    })),

    toggleNeedToAdd: (id: string) => set((state) => ({
        needToAdd: state.needToAdd.includes(id)
            ? state.needToAdd.filter(x => x !== id)
            : [...state.needToAdd, id]
    })),

    toggleNeedToDelete: (id: string) => set((state) => ({
        needToDelete: state.needToDelete.includes(id)
            ? state.needToDelete.filter(x => x !== id)
            : [...state.needToDelete, id]
    })),

    clearNeedToAdd: () => set({ needToAdd: [] }),

    clearNeedToDelete: () => set({ needToDelete: [] })
}))
