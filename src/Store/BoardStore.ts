import { create } from "zustand";
import {
  dummyLayerData,
  type GroupNode,
  type LayerData,
  type LayerNode,
  type ShapeNode,
  type UndoType,
} from "../Data/LayerData";

interface BoardStoreProps {
  allShapes: LayerData;
  toggleVisibility: (id: string) => void;
  addNewShape: (newShape: ShapeNode, layer: string) => void;
  clearShapes: () => void;
  undoStack: UndoType[];
  redoStack: UndoType[];
  addNewUndo: (newAction: UndoType) => void;
  modifyStacks: (newStack: UndoType[], stackType: string) => void;
  updateShapesUndoRedo: (
    latestAction: UndoType,
    actionType: "undo" | "redo"
  ) => void;
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

  undoStack: [],
  redoStack: [],

  addNewUndo: (newAction) => {
    const prev = get().undoStack;
    set({ undoStack: [...prev, newAction] });
  },

  modifyStacks: (newStack, stackType) => {
    switch (stackType) {
      case "undo":
        set({ undoStack: newStack });
        break;

      case "redo":
        set({ redoStack: newStack });
        break;

      default:
        break;
    }
  },

  updateShapesUndoRedo: (latestAction, actionType) => {
    let currentData = get().allShapes;
    const id = latestAction.shapeDetails.id;
    const parentId = latestAction.shapeDetails.parentId;
    console.log(latestAction);

    switch (actionType) {
      case "undo":
        switch (latestAction.type) {
          case "Add":
            {
              if (parentId === "root") {
                const updatedRoot = {
                  ...currentData.root,
                  children: currentData.root.children.filter(
                    (child) => child !== id
                  ),
                };
                currentData = {
                  ...currentData,
                  root: updatedRoot,
                };
              } else if (currentData.nodes[parentId].type === "group") {
                currentData = {
                  ...currentData,
                  nodes: {
                    ...currentData.nodes,
                    [parentId]: {
                      ...currentData.nodes[parentId],
                      children: [
                        ...currentData.nodes[parentId].children,
                      ].filter((child) => child !== id),
                    },
                  },
                };
              }
              currentData = {
                ...currentData,
                nodes: Object.fromEntries(
                  Object.entries(currentData.nodes).filter(
                    ([node]) => node !== id
                  )
                ),
              };
              console.log(currentData);

              set({ allShapes: currentData });
            }
            break;

          case "Remove":
            {
              const id = latestAction.shapeDetails.id;
              const parentId = latestAction.shapeDetails.parentId;

              currentData = {
                ...currentData,
                nodes: {
                  ...currentData.nodes,
                  [id]: latestAction.shapeDetails,
                },
              };

              if (parentId === "root") {
                currentData = {
                  ...currentData,
                  root: {
                    ...currentData.root,
                    children: [...currentData.root.children, id],
                  },
                };
              } else if (currentData.nodes[parentId].type === "group") {
                currentData = {
                  ...currentData,
                  nodes: {
                    ...currentData.nodes,
                    [parentId]: {
                      ...currentData.nodes[parentId],
                      children: [...currentData.nodes[parentId].children, id],
                    },
                  },
                };
              }
            }

            set({ allShapes: currentData });
            break;

          default:
            break;
        }
        break;

      case "redo":
        {
          switch (latestAction.type) {
            case "Remove":
              {
                const id = latestAction.shapeDetails.id;
                const parentId = latestAction.shapeDetails.parentId;

                currentData = {
                  ...currentData,
                  nodes: {
                    ...currentData.nodes,
                    [id]: latestAction.shapeDetails,
                  },
                };

                if (parentId === "root") {
                  currentData = {
                    ...currentData,
                    root: {
                      ...currentData.root,
                      children: [...currentData.root.children, id],
                    },
                  };
                } else if (currentData.nodes[parentId].type === "group") {
                  currentData = {
                    ...currentData,
                    nodes: {
                      ...currentData.nodes,
                      [parentId]: {
                        ...currentData.nodes[parentId],
                        children: [...currentData.nodes[parentId].children, id],
                      },
                    },
                  };
                }
              }

              set({ allShapes: currentData });
              break;

            case "Add":
              {
                if (parentId === "root") {
                  const updatedRoot = {
                    ...currentData.root,
                    children: currentData.root.children.filter(
                      (child) => child !== id
                    ),
                  };
                  currentData = {
                    ...currentData,
                    root: updatedRoot,
                  };
                } else if (currentData.nodes[parentId].type === "group") {
                  currentData = {
                    ...currentData,
                    nodes: {
                      ...currentData.nodes,
                      [parentId]: {
                        ...currentData.nodes[parentId],
                        children: [
                          ...currentData.nodes[parentId].children,
                        ].filter((child) => child !== id),
                      },
                    },
                  };
                }
                currentData = {
                  ...currentData,
                  nodes: Object.fromEntries(
                    Object.entries(currentData.nodes).filter(
                      ([node]) => node !== id
                    )
                  ),
                };
                console.log(currentData);

                set({ allShapes: currentData });
              }
              break;
              break;

            default:
              break;
          }
        }
        break;

      default:
        break;
    }
  },
}));
