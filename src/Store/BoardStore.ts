import type Konva from "konva";
import { create } from "zustand";
import {
  dummyLayerData,
  type GroupNode,
  type LayerData,
  type LayerNode,
  type ShapeNode,
  type UndoType,
  type UpdateType,
} from "../Data/LayerData";
import { createRef, type RefObject } from "react";

interface BoardStoreProps {
  allShapes: LayerData;
  stageRef: RefObject<Konva.Stage | null>;
  transformerRef: RefObject<Konva.Transformer | null>;
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
  updateSingleShape: (action: UpdateType) => void;
  updateShapeNodes: (updatedShapes: LayerNode[]) => void;
  deleteShapeGroup: (shapeOrGroupId: string) => void;
}

export const useBoardStore = create<BoardStoreProps>((set, get) => ({
  allShapes: dummyLayerData,
  stageRef: createRef<Konva.Stage>(),
  transformerRef: createRef<Konva.Transformer>(),
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

  // ! new Shape Add - When Drawing
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

  // ! After Drawing/updating a shape - use this addNewUndo to update the undo
  addNewUndo: (newAction) => {
    const prev = get().undoStack;
    set({ undoStack: [...prev, newAction] });
  },

  // ! gets a full new stack for undo|redo and replace it
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

  // ! when clicked on the undo or redo - update the shape - only for the ||**undo redo handlers hook**||
  updateShapesUndoRedo: (latestAction, actionType) => {
    let currentData = get().allShapes;
    const id =
      latestAction.type === "Update"
        ? latestAction.id
        : latestAction.shapeDetails.id;
    const parentId =
      latestAction.type === "Update"
        ? latestAction.parentId
        : latestAction.shapeDetails.parentId;

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

              set({ allShapes: currentData });
            }
            break;

          case "Remove":
            {
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

          case "Update":
            {
              const node = currentData.nodes[id];
              if (!node || node.type !== "shape") break;

              const shapeNode = node as ShapeNode;

              currentData = {
                ...currentData,
                nodes: {
                  ...currentData.nodes,
                  [id]: {
                    ...shapeNode,
                    props: {
                      ...shapeNode.props,
                      ...latestAction.prev,
                    },
                  },
                },
              };
              set({ allShapes: currentData });
            }
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

                set({ allShapes: currentData });
              }
              break;

            case "Update":
              {
                const node = currentData.nodes[id];
                if (!node || node.type !== "shape") break;

                const shapeNode = node as ShapeNode;

                currentData = {
                  ...currentData,
                  nodes: {
                    ...currentData.nodes,
                    [id]: {
                      ...shapeNode,
                      props: {
                        ...shapeNode.props,
                        ...latestAction.prev,
                      },
                    },
                  },
                };
              }

              set({ allShapes: currentData });
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

  // ! Update the Props of a shape
  // ? Todo Update the pos, parentId of the shape
  updateSingleShape: (action) => {
    const prev = get().allShapes;
    const node = prev.nodes[action.id];
    if (!node || node.type !== "shape") return;

    const updatedNodes: ShapeNode = {
      ...node,
      props: {
        ...node.props,
        ...action.next,
      },
    };

    set({
      allShapes: {
        ...prev,
        nodes: {
          ...prev.nodes,
          [action.id]: updatedNodes,
        },
      },
    });
  },

  updateShapeNodes: (updatedShapes) => {
    const nodes = get().allShapes.nodes;

    updatedShapes.forEach((item) => {
      nodes[item.id] = {
        ...nodes[item.id],
        pos: item.pos,
      };
    });

    set({
      allShapes: {
        ...get().allShapes,
        nodes,
      },
    });
  },

  deleteShapeGroup: (shapeOrGroupId) => {
    const allShapes = get().allShapes;
    let updatedChildren = allShapes.root.children;
    const nodes = allShapes.nodes;
    const node = allShapes.nodes[shapeOrGroupId];
    const parentId = node.parentId;
    if (!node) return;

    const newNodes = { ...nodes };

    const deleteNode = (id: string) => {
      const node = newNodes[id];
      if (!node) return;

      // If group, recursively delete children
      if (node.type === "group") {
        node.children.forEach(deleteNode);
      }

      // Delete the node itself
      delete newNodes[id];
    };

    if (parentId === "root") {
      updatedChildren = updatedChildren.filter((id) => id !== node.id);
    } else {
      const parentNode = { ...newNodes[parentId] };
      if (parentNode && parentNode.type === "group") {
        parentNode.children = parentNode.children.filter(
          (id) => id !== node.id
        );
        newNodes[parentNode.id] = parentNode;
      }
    }

    deleteNode(node.id);

    set({
      allShapes: {
        root: {
          children: updatedChildren,
        },
        nodes: newNodes,
      },
    });
  },
}));
