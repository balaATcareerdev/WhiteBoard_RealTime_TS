import { create } from "zustand";

interface SelectionState {
  selectedIds: string[];
  activeId: string;

  selectId: (id: string) => void;
  deselect: (id: string) => void;
  clearSelection: () => void;
  toggle: (id: string) => void;
  setActive: (id: string) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedIds: [],
  activeId: "root",

  selectId: (id) => {
    set((s) => ({
      selectedIds: [...s.selectedIds, id],
    }));
  },
  deselect: (id) => {
    set((s) => ({
      selectedIds: s.selectedIds.filter((selectedId) => selectedId !== id),
    }));
  },
  clearSelection: () => {
    set({ selectedIds: [] });
  },
  toggle: (id) => {
    set((s) =>
      s.selectedIds.includes(id)
        ? {
            selectedIds: s.selectedIds.filter(
              (selectedId) => selectedId !== id,
            ),
          }
        : {
            selectedIds: [...s.selectedIds, id],
          },
    );
  },
  setActive: (id) => {
    set({ activeId: id });
  },
}));
