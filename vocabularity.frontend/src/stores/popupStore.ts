import { create } from 'zustand'

interface PopupStateStore {
    extractNewWordsPopup: [string, string]
    showExtractNewWordsPopup: (state: string, message: string) => void
    hideExtractNewWordsPopup: () => void

    addNewWordsPopup: [string, number]
    showAddNewWordsPopup: (count: number) => void
    hideAddNewWordsPopup: () => void

    deleteWordsPopup: [string, number]
    showDeleteWordsPopup: (count: number) => void
    hideDeleteWordsPopup: () => void
}

export const usePopupStateStore = create<PopupStateStore>((set) => ({
    extractNewWordsPopup: ["hide", ""],
    showExtractNewWordsPopup: (state: string, message: string) => set({ extractNewWordsPopup: [state, message] }),
    hideExtractNewWordsPopup: () => set({ extractNewWordsPopup: ["hide", ""] }),

    addNewWordsPopup: ["hide", 0],
    showAddNewWordsPopup: (count: number) => set({ addNewWordsPopup: ["show", count] }),
    hideAddNewWordsPopup: () => set({ addNewWordsPopup: ["hide", 0] }),

    deleteWordsPopup: ["hide", 0],
    showDeleteWordsPopup: (count: number) => set({ deleteWordsPopup: ["show", count] }),
    hideDeleteWordsPopup: () => set({ deleteWordsPopup: ["hide", 0] }),
}))