import { create } from "zustand";

interface TransformState {
  transformELemId: string | null;
  setTransformElemId: (id: string | null) => void;
}

export const useTransformStore = create<TransformState>((set) => ({
  transformELemId: null,
  setTransformElemId: (id) => set({ transformELemId: id }),
}));
