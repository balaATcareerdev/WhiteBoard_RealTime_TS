import { create } from "zustand";
import { dummyLayerData, type LayerData } from "../Data/LayerData";

interface BoardStoreProps {
  allShapes: LayerData;
  toggleVisibility: (id: string) => void;
}

export const useBoardStore = create<BoardStoreProps>((set, get) => ({
  allShapes: dummyLayerData,
  toggleVisibility: (id) => {
    const prev = get().allShapes;
    set({
      allShapes: {
        ...prev,
        nodes: {
          ...prev.nodes,
          [id]: {
            ...prev.nodes[id],
            visibility: !prev.nodes[id].visibility,
          },
        },
      },
    });
  },
}));
