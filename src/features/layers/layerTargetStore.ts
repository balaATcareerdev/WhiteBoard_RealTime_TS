import { create } from "zustand";

interface LayerTargetState {
  targetLayerId: string;
  setTargetLayerId: (id: string) => void;
}

export const useLayerTargetStore = create<LayerTargetState>((set) => ({
  targetLayerId: "root",
  setTargetLayerId: (id: string) => set({ targetLayerId: id }),
}));
