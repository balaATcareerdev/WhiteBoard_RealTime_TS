import { create } from "zustand";
import type { HistoryAction } from "./type";
import type { LayerTree } from "../layers/type";
import { useLayerStore } from "../layers/layerStore";

interface historyState {
  undoStack: HistoryAction[];
  redoStack: HistoryAction[];
  addNewUndo: (action: HistoryAction) => void;
  modifyStacks: (newStack: HistoryAction[], stackType: string) => void;
  updateShapesUndoRedo: (
    action: HistoryAction,
    actionType: "undo" | "redo",
  ) => void;
  updateSingleShape: (action: HistoryAction) => void;
  clearHistory: () => void;
}

function removeFromParent(tree: LayerTree, id: string, parentId: string) {
  if (parentId === "root") {
    tree.root.children = tree.root.children.filter((c) => c !== id);
  } else {
    const parent = tree.nodes[parentId];
    if (parent?.type === "group") {
      parent.children = parent.children.filter((c) => c !== id);
    }
  }
}

function addToParent(tree: LayerTree, id: string, parentId: string) {
  if (parentId === "root") {
    tree.root.children.push(id);
  } else {
    const parent = tree.nodes[parentId];
    if (parent?.type === "group") {
      parent.children.push(id);
    }
  }
}

export const useHistoryStore = create<historyState>((set) => ({
  undoStack: [],
  redoStack: [],

  //adding new Undo Action
  addNewUndo: (action) => {
    set((state) => ({ undoStack: [...state.undoStack, action] }));
  },

  // setting the full new Stack to Undo, Redo
  modifyStacks: (newStack, stackType) => {
    set(
      stackType === "undo" ? { undoStack: newStack } : { redoStack: newStack },
    );
  },

  //update single Shape
  updateSingleShape: (action) => {
    if (action.type !== "Update") return;

    // data from Layer Store
    const layer = useLayerStore.getState();
    const node = layer.allShapes.nodes[action.id];
    if (!node || node.type !== "shape") return;

    //   Assign Props
    Object.assign(node.props, action.next);

    useLayerStore.setState({ allShapes: layer.allShapes });
  },

  updateShapesUndoRedo: (action, actionType) => {
    const layer = useLayerStore.getState();
    const tree = layer.allShapes;
    const nodes = tree.nodes;

    const id = action.type === "Update" ? action.id : action.shapeDetails.id;

    const parentId =
      action.type === "Update" ? action.parentId : action.shapeDetails.parentId;

    if (actionType === "undo") {
      if (action.type === "Add") {
        removeFromParent(tree, id, parentId);
        delete nodes[id];
      } else if (action.type === "Remove") {
        nodes[id] = action.shapeDetails;
        addToParent(tree, id, parentId);
      } else if (action.type === "Update") {
        console.log("Undo Action", action);

        const node = nodes[action.id];
        if (node?.type === "shape") {
          Object.assign(node.props, action.prev);
        }
      }
    } else if (actionType === "redo") {
      if (action.type === "Remove") {
        nodes[id] = action.shapeDetails;
        addToParent(tree, id, parentId);
      }

      if (action.type === "Add") {
        removeFromParent(tree, id, parentId);
        delete nodes[id];
      }

      if (action.type === "Update") {
        console.log("Redo Action", action);

        const node = nodes[id];
        console.log(node);

        if (node?.type === "shape") {
          Object.assign(node.props, action.prev);
        }
      }
    }

    console.log("Tree", tree);

    useLayerStore.setState({
      allShapes: tree,
    });
  },

  clearHistory: () => {
    set({
      undoStack: [],
      redoStack: [],
    });
  },
}));
