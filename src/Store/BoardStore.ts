import type Konva from "konva";
import { create } from "zustand";
import {
  // dummyLayerData,
  type GroupNode,
  type LayerData,
  type LayerNode,
  type ShapeNode,
  type UndoType,
  type UpdateType,
} from "../Data/LayerData";
import { createRef, type RefObject } from "react";
import { getAncestorsOfShape } from "../Utils/NewGroupUtils";
import { getDestinationLayer } from "../Utils/NewGroupUtils";
import { useLayerStore } from "./LayerStore";

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
    actionType: "undo" | "redo",
  ) => void;
  updateSingleShape: (action: UpdateType) => void;
  updateShapeNodes: (updatedShapes: LayerNode[]) => void;
  deleteShapeGroup: (shapeOrGroupId: string) => void;
  unGroup: (activeLayer: string) => void;
  createGroup: (selectedShapeIds: string[]) => void;
  duplicateLayer: (shapeId: string) => void;
  updatePositionOfLayer: (
    nodes: Record<string, LayerNode>,
    groupId: string,
  ) => Record<string, LayerNode>;
  setLockShape: (id: string) => void;
  updateProps: (
    id: string,
    propName: string,
    value: number | string | number[] | undefined,
  ) => void;
}

export const useBoardStore = create<BoardStoreProps>((set, get) => ({
  allShapes: {
    root: {
      children: [],
    },
    nodes: {},
  },
  stageRef: createRef<Konva.Stage>(),
  transformerRef: createRef<Konva.Transformer>(),
  toggleVisibility: (id) => {
    const prev = get().allShapes;

    let nodes = { ...prev.nodes };
    let node = { ...nodes[id] };

    node = {
      ...node,
      visibility: !node.visibility,
    };

    nodes = {
      ...nodes,
      [id]: node,
    };

    if (node.type === "group") {
      node.children.forEach((id) => {
        nodes = {
          ...nodes,
          [id]: {
            ...nodes[id],
            visibility: node.visibility,
          },
        };
      });
    }

    set({
      allShapes: {
        ...prev,
        nodes,
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
      undoStack: [],
      redoStack: [],
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
                    (child) => child !== id,
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
                    ([node]) => node !== id,
                  ),
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
                      (child) => child !== id,
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
                      ([node]) => node !== id,
                    ),
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
          (id) => id !== node.id,
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

    get().addNewUndo({
      type: "Remove",
      startingPos: { x: 0, y: 0 },
      shapeDetails: node as ShapeNode,
    });
  },

  unGroup: (activeLayer) => {
    const allShapes = get().allShapes;
    let childrenRoot: string[] = [...allShapes.root.children];
    const nodes = { ...allShapes.nodes };

    const group = nodes[activeLayer];
    if (!group) return;
    if (group.type !== "group") return;
    const parentId = group.parentId; //! Root

    let { [activeLayer]: _, ...nodesCopy } = { ...nodes };

    // Update the Root, if its a root elements
    if (childrenRoot && group.parentId === "root") {
      childrenRoot = childrenRoot.filter((id) => id !== activeLayer);
    }

    const layersToModify = group.children;
    layersToModify.forEach((id: string) => {
      nodesCopy = {
        ...nodesCopy,
        [id]: {
          ...nodesCopy[id],
          pos: group.pos,
          parentId,
        },
      };
      if (group.parentId === "root") {
        childrenRoot.push(id);
      }
    });

    const updatedNodesPos = get().updatePositionOfLayer(
      nodesCopy,
      group.parentId,
    );

    set({
      allShapes: {
        ...allShapes,
        root: {
          children: childrenRoot,
        },
        nodes: updatedNodesPos,
      },
    });
  },

  createGroup: (selectedShapeIds) => {
    const { allShapes } = get();
    const nodes = { ...allShapes.nodes };
    const allAncestors: string[][] = [];
    const childrenRoot: string[] = [...allShapes.root.children];

    // Find All Ancestors
    selectedShapeIds?.forEach((id) => {
      const ancestors = getAncestorsOfShape(id, nodes);
      allAncestors.push(ancestors);
    });

    if (allAncestors.length === 0) return;

    // Target Destination Layer
    const destination = getDestinationLayer(allAncestors);

    // New Node
    const newGroupId = crypto.randomUUID();
    const newGroupNode: GroupNode = {
      id: newGroupId,
      name: "New Group",
      type: "group",
      parentId: destination,
      children: selectedShapeIds,
      pos: 0,
      visibility: true,
      lock: false,

      props: {
        x: 0,
        y: 0,
        rotation: 0,
      },
    };

    // Add the New Group to the nodes
    let updatedNodes = {
      ...nodes,
      [newGroupId]: newGroupNode,
    };

    // Update the Parent value of the selected shapes
    selectedShapeIds.forEach((id) => {
      const node = updatedNodes[id];
      if (!node) return;
      const parentId = node.parentId;
      if (!node) return;

      if (destination === "root") {
        const idx = childrenRoot.indexOf(id);
        if (idx !== -1) childrenRoot.splice(idx, 1);
      }

      updatedNodes = {
        ...updatedNodes,
        [node.id]: {
          ...node,
          parentId: newGroupId,
        },
        [parentId]:
          updatedNodes[parentId] &&
          updatedNodes[parentId].type === "group" &&
          parentId !== "root"
            ? {
                ...updatedNodes[parentId],
                children: updatedNodes[parentId].children.filter(
                  (cId) => cId !== id,
                ),
              }
            : updatedNodes[parentId],
      };
    });

    // Update the Roots
    if (destination === "root") {
      childrenRoot.push(newGroupId);
    } else {
      const destinationNode = updatedNodes[destination];
      if (destinationNode?.type === "group") {
        updatedNodes = {
          ...updatedNodes,
          [destination]: {
            ...destinationNode,
            children: [...destinationNode.children, newGroupId],
          },
        };
      }
    }

    useLayerStore.getState().setActiveLayer(newGroupId);

    set({
      allShapes: {
        ...allShapes,
        nodes: get().updatePositionOfLayer(updatedNodes, destination),
        root: {
          children: childrenRoot,
        },
      },
    });
  },

  duplicateLayer: (shapeId) => {
    const allShapes = get().allShapes;
    const root = { ...allShapes.root };
    let nodes = { ...allShapes.nodes };
    const nodeToDuplicate = nodes[shapeId];
    if (!nodeToDuplicate) return;
    const newId = crypto.randomUUID();

    const duplicatedNode: LayerNode = {
      ...nodeToDuplicate,
      id: newId,
      name: nodeToDuplicate.name + " Copy",
      pos: nodeToDuplicate.pos + 1,
    };

    nodes = {
      ...nodes,
      [newId]: duplicatedNode,
    };

    if (nodeToDuplicate.parentId === "root") {
      root.children.push(newId);
    } else {
      const parentNode = nodes[nodeToDuplicate.parentId];
      if (parentNode.type === "group") {
        parentNode.children.push(newId);
        nodes = {
          ...nodes,
          [nodeToDuplicate.parentId]: parentNode,
        };
      }
    }

    const updatedNodesPos = get().updatePositionOfLayer(
      nodes,
      nodeToDuplicate.parentId,
    );

    set({
      allShapes: {
        ...allShapes,
        root: root,
        nodes: updatedNodesPos,
      },
    });

    get().addNewUndo({
      type: "Add",
      startingPos: { x: 0, y: 0 },
      shapeDetails: updatedNodesPos[newId] as ShapeNode,
    });
  },

  updatePositionOfLayer: (nodes, groupId) => {
    let nodesCopy = { ...nodes };
    const arrayOfNodes = Object.entries(nodes)
      .filter(([_, node]) => node && node.parentId === groupId)
      .sort(([, nodeA], [_, nodeB]) => nodeB.pos - nodeA.pos)
      .map(([id]) => id);

    arrayOfNodes.forEach((id) => {
      const pos = arrayOfNodes.length - arrayOfNodes.indexOf(id);
      nodesCopy = {
        ...nodesCopy,
        [id]: {
          ...nodesCopy[id],
          pos,
        },
      };
    });

    return nodesCopy;
  },

  setLockShape: (id) => {
    const allShapes = get().allShapes;
    let updatedNodes = { ...allShapes.nodes };
    let node = { ...updatedNodes[id] };

    node = {
      ...node,
      lock: !node.lock,
    };
    updatedNodes = {
      ...updatedNodes,
      [id]: node,
    };

    if (node.type === "group") {
      node.children.forEach((id) => {
        updatedNodes = {
          ...updatedNodes,
          [id]: {
            ...updatedNodes[id],
            lock: node.lock,
          },
        };
      });
    }

    set({
      allShapes: {
        ...allShapes,
        nodes: updatedNodes,
      },
    });
  },

  updateProps: (id, propName, value) => {
    const allShapes = get().allShapes;
    const nodes = {
      ...allShapes.nodes,
    };
    const node = nodes[id];

    const updatedNodes = {
      ...nodes,
      [id]: {
        ...nodes[id],
        name: propName === "name" ? value : node.name,
        props: {
          ...node.props,
          [propName]:
            propName !== "name" && node.type !== "group"
              ? value
              : node.props[propName as keyof typeof node.props],
        },
      },
    };

    set({
      allShapes: {
        ...allShapes,
        nodes: {
          ...updatedNodes,
        },
      },
    });
  },
}));
