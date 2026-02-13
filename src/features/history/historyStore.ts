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
    const nodes = { ...tree.nodes };

    const id =
      action.type === "Update"
        ? action.id
        : action.type === "AddGroup" || action.type === "RemoveGroup"
          ? action.groupDetails.id
          : action.shapeDetails.id;

    const parentId =
      action.type === "Update"
        ? action.parentId
        : action.type === "AddGroup" || action.type === "RemoveGroup"
          ? action.groupDetails.parentId
          : action.shapeDetails.parentId;

    console.log("Action", action);

    if (
      action.type === "Add" &&
      (actionType === "undo" || actionType === "redo")
    ) {
      // WHen You wanna undo an Removed Elem
      removeFromParent(tree, id, parentId);
      delete nodes[id];
    } else if (
      action.type === "Remove" &&
      (actionType === "undo" || actionType === "redo")
    ) {
      // When you wanna undo an Added Elem
      nodes[id] = action.shapeDetails;
      addToParent(tree, id, parentId);
    } else if (
      action.type === "Update" &&
      (actionType === "undo" || actionType === "redo")
    ) {
      // When you wanna undo/redo an Updated Elem
      const node = nodes[action.id];
      if (node?.type === "shape") {
        Object.assign(node.props, action.prev);
      }
    } else if (
      action.type === "AddGroup" &&
      (actionType === "undo" || actionType === "redo")
    ) {
      layer.unGroup(action.groupDetails.id);
    } else if (
      action.type === "RemoveGroup" &&
      (actionType === "undo" || actionType === "redo")
    ) {
      console.log(action.groupDetails);
      nodes[action.groupDetails.id] = action.groupDetails;
      addToParent(tree, action.groupDetails.id, action.groupDetails.parentId);

      action.groupDetails.children.forEach((id) => {
        const node = nodes[id];
        if (!node) return;

        removeFromParent(tree, id, node.parentId);
        node.parentId = action.groupDetails.id;
      });
    }

    // if (actionType === "undo") {
    //   console.log("Doing Undo...");

    //   if (action.type === "Add") {
    //     removeFromParent(tree, id, parentId);
    //     delete nodes[id];
    //   } else if (action.type === "Remove") {
    //     nodes[id] = action.shapeDetails;
    //     addToParent(tree, id, parentId);
    //   } else if (action.type === "Update") {
    //     const node = nodes[action.id];
    //     if (node?.type === "shape") {
    //       Object.assign(node.props, action.prev);
    //     }
    //   } else if (action.type === "AddGroup") {
    //     layer.unGroup(action.groupDetails.id);
    //   } else if (action.type === "RemoveGroup") {
    //     layer.createGroup(action.groupDetails.children);
    //   }
    // } else if (actionType === "redo") {
    //   console.log("DOing Redo");

    //   if (action.type === "Remove") {
    //     nodes[id] = action.shapeDetails;
    //     addToParent(tree, id, parentId);
    //   } else if (action.type === "Add") {
    //     removeFromParent(tree, id, parentId);
    //     delete nodes[id];
    //   } else if (action.type === "Update") {
    //     const node = nodes[id];

    //     if (node?.type === "shape") {
    //       Object.assign(node.props, action.prev);
    //     }
    //   } else if (action.type === "AddGroup") {
    //     useLayerStore.getState().unGroup(action.groupDetails.id);
    //   } else if (action.type === "RemoveGroup") {
    //     console.log("Supposed to Re Add the Group");
    //     useLayerStore.getState().createGroup(action.groupDetails.children);
    //   }
    // }

    console.log("Tree", tree);

    useLayerStore.setState((state) => ({
      allShapes: {
        ...state.allShapes,
        nodes,
      },
    }));
  },

  clearHistory: () => {
    set({
      undoStack: [],
      redoStack: [],
    });
  },
}));
