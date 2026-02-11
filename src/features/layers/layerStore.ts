import { create } from "zustand";
import type { GroupNode, LayerNode, LayerTree, ShapeNode } from "./type";
import {
  getAncestorsOfShape,
  getDestinationLayer,
} from "../../Utils/treeUtils";
import { useHistoryStore } from "../history/historyStore";

interface LayerState {
  allShapes: LayerTree;
  toggleVisiblityOfLayer: (id: string) => void;
  addNewShape: (newShape: ShapeNode, layer: string) => void;
  clearShapes: () => void;
  updateShapeNodes: (updatedShapes: LayerNode[]) => void;
  deleteShapeGroup: (shapeOrGroupId: string) => void;
  unGroup: (activeLayer: string) => void;
  createGroup: (selectedShapeIds: string[]) => void;
  duplicateLayer: (shapeId: string) => void;
  setLockShape: (id: string) => void;
  updateProps: (
    id: string,
    propName: string,
    value: number | string | number[] | undefined,
  ) => void;
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

export const useLayerStore = create<LayerState>((set) => ({
  allShapes: {
    root: { children: [] },
    nodes: {},
  },

  toggleVisiblityOfLayer: (id) => {
    set((state) => {
      const tree = state.allShapes;
      const nodes = { ...tree.nodes };
      const node = nodes[id];

      if (!node) return state;

      if (node.type === "group") {
        node.children.forEach((childId) => {
          const child = nodes[childId];
          if (childId) child.visibility = node.visibility;
        });
      }

      return {
        allShapes: {
          ...state.allShapes,
          nodes,
        },
      };
    });
  },

  addNewShape: (newShape, layer) => {
    set((state) => {
      const tree = state.allShapes;
      const nodes = tree.nodes;

      nodes[newShape.id] = {
        ...newShape,
        parentId: layer,
      };

      addToParent(tree, newShape.id, layer);

      return { allShapes: tree };
    });
  },

  clearShapes: () => {
    set((state) => {
      const tree = state.allShapes;
      tree.root.children = [];
      tree.nodes = {};

      return { allShapes: tree };
    });

    // Clear Undo and redo History when you clear the board
    useHistoryStore.getState().clearHistory();
  },

  updateShapeNodes: (updated) => {
    set((state) => {
      const newNodes = { ...state.allShapes.nodes };

      updated.forEach((item) => {
        const oldNode = newNodes[item.id];
        if (!oldNode) return;

        newNodes[item.id] = {
          ...oldNode,
          pos: item.pos,
        };
      });

      return {
        allShapes: {
          ...state.allShapes,
          nodes: newNodes,
        },
      };
    });
  },

  deleteShapeGroup: (id) => {
    set((state) => {
      const tree = state.allShapes;
      const nodes = { ...tree.nodes };
      const node = nodes[id];
      if (!node) return state;

      removeFromParent(tree, id, node.parentId);

      const deleteNode = (nId: string) => {
        const node = nodes[nId];
        if (!node) return;

        if (node.type === "group") {
          node.children.forEach(deleteNode);
          delete nodes[nId];
        }
      };
      if (node.type !== "group") {
        useHistoryStore.getState().addNewUndo({
          type: "Remove",
          startingPos: { x: 0, y: 0 },
          shapeDetails: {
            ...node,
          },
        });
      } else {
        useHistoryStore.getState().addNewUndo({
          type: "RemoveGroup",
          startingPos: { x: 0, y: 0 },
          groupDetails: { ...(node as GroupNode) },
        });
      }
      deleteNode(id);
      return {
        allShapes: {
          ...state.allShapes,
          nodes,
        },
      };
    });
  },

  setLockShape: (id) => {
    set((state) => {
      const tree = state.allShapes;
      const node = tree.nodes[id];
      if (!node) return state;

      if (node.type === "group") {
        node.children.forEach((childId) => {
          const child = tree.nodes[childId];
          if (child) child.lock = node.lock;
        });
      }

      return { allShapes: tree };
    });
  },

  updateProps: (id, propName, value) => {
    set((state) => {
      const tree = state.allShapes;
      const node = tree.nodes[id];
      if (!node) return state;

      if (propName === "name") node.name = value as string;
      else if (node.type !== "group") {
        (node.props as any)[propName] = value;
      }

      return { allShapes: tree };
    });
  },

  duplicateLayer: (shapeId) => {
    set((state) => {
      const tree = state.allShapes;
      const nodes = { ...tree.nodes };
      const node = nodes[shapeId];
      if (!node) return state;

      const newId = crypto.randomUUID();
      const copyNode = {
        ...node,
        id: newId,
        name: node.name + " Copy",
        pos: node.pos + 1,
      };

      nodes[newId] = copyNode;
      addToParent(tree, newId, node.parentId);

      return { allShapes: { ...state.allShapes, nodes } };
    });
  },

  unGroup: (groupId) => {
    set((state) => {
      const tree = state.allShapes;
      const nodes = tree.nodes;
      const group = nodes[groupId];
      if (!group || group.type !== "group") return state;

      const parentId = group.parentId;

      removeFromParent(tree, group.id, parentId);

      group.children.forEach((childId) => {
        const child = nodes[childId];
        if (!child) return;

        child.parentId = parentId;
        child.pos = group.pos;

        addToParent(tree, childId, parentId);
      });

      delete nodes[groupId];

      return { allShapes: tree };
    });
  },
  createGroup: (selectedShapeIds) => {
    set((state) => {
      if (!selectedShapeIds.length) return state;

      const tree = state.allShapes;
      const nodes = { ...tree.nodes };

      const allAncestors = selectedShapeIds.map((id) => {
        return getAncestorsOfShape(id, nodes);
      });

      const destination = getDestinationLayer(allAncestors);

      const newId = crypto.randomUUID();

      const newGroup: GroupNode = {
        id: newId,
        name: "New Group",
        type: "group",
        parentId: destination,
        children: [...selectedShapeIds],
        pos: 0,
        visibility: true,
        lock: false,
        props: { x: 0, y: 0 },
      };

      nodes[newId] = newGroup;
      addToParent(tree, newId, destination);

      selectedShapeIds.forEach((id) => {
        const node = nodes[id];
        if (!node) return;

        removeFromParent(tree, id, node.parentId);
        node.parentId = newId;
      });

      // add undo
      useHistoryStore.getState().addNewUndo({
        type: "AddGroup",
        startingPos: { x: 0, y: 0 },
        groupDetails: newGroup,
      });

      return {
        allShapes: {
          ...state.allShapes,
          nodes,
        },
      };
    });
  },
}));
