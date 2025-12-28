import { create } from "zustand";

interface LayerStoreProps {
  selectedLayers: string[];
  setSelectedLayers: (id: string, status: boolean) => void;
  activeLayer: string;
  setActiveLayer: (nodeId: string) => void;
  transformElem: string | null;
  setTransformElem: (newId: string | null) => void;
  layerToDraw: string;
  setLayerToDraw: (newLayer: string) => void;
}

export const useLayerStore = create<LayerStoreProps>((set, get) => ({
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
  setActiveLayer: (nodeId) => {
    const currentLayer = get().activeLayer;
    if (currentLayer === nodeId) {
      set({ activeLayer: "root" });
      return;
    }
    set({ activeLayer: nodeId });
  },
  transformElem: null,
  setTransformElem: (newId: string | null) => {
    set({ transformElem: newId });
  },
  layerToDraw: "root",
  setLayerToDraw: (newLayer) => {
    console.log(newLayer);
    if (get().layerToDraw === newLayer) {
      set({ layerToDraw: "root" });
      return;
    }
    set({ layerToDraw: newLayer });
  },
}));
