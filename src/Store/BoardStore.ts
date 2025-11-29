import { create } from "zustand";
import {
  dummyLayerData,
  type GroupNode,
  type LayerData,
  type LayerNode,
  type ShapeNode,
} from "../Data/LayerData";

interface BoardStoreProps {
  allShapes: LayerData;
  toggleVisibility: (id: string) => void;
  addNewShape: (newShape: ShapeNode, layer: string) => void;
  clearShapes: () => void;
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
  addNewShape: (newShape, layer) => {
    const prev = get().allShapes;
    console.log(layer);

    const updatedRoot =
      layer === "root"
        ? { ...prev.root, children: [...prev.root.children, newShape.id] }
        : prev.root;

    let updatedNodes: Record<string, LayerNode> = {
      ...prev.nodes,
      [newShape.id]: {
        ...newShape,
        parentId: layer,
      },
    };

    // we are adding the shape into a group
    if (layer !== "root") {
      const parent = prev.nodes[layer];
      if (!parent) {
        return;
      }
      if (parent.type !== "group") {
        return;
      }
      const groupParent = parent as GroupNode;

      updatedNodes = {
        ...updatedNodes,
        [groupParent.id]: {
          ...groupParent,
          children: [...groupParent.children, newShape.id],
        },
      };
    }

    set({
      allShapes: {
        ...prev,
        root: updatedRoot,
        nodes: updatedNodes,
      },
    });
  },

  clearShapes: () => {
    const prev = get().allShapes;
    set({
      allShapes: {
        ...prev,
        root: {
          ...prev.root,
          children: [],
        },
        nodes: {},
      },
    });
  },
}));
