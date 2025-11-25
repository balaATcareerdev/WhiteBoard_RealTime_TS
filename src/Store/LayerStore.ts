import { create } from "zustand";

interface LayerStoreProps {
  selectedLayers: string[];
  setSelectedLayers: (id: string, status: boolean) => void;
  activeLayer: string;
  setActiveLayer: () => void;
}

export const useLayerStore = create<LayerStoreProps>((set) => ({
  selectedLayers: [],
  setSelectedLayers: (id, status) => {
    set((state) => {
      if (status) {
        return { selectedLayers: [...state.selectedLayers, id] };
      }

      return {
        selectedLayers: [...state.selectedLayers].filter(
          (currentId) => currentId != id
        ),
      };
    });
  },
  activeLayer: "root",
  setActiveLayer: () => {},
}));
