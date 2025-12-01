import { useLayerStore } from "./../Store/LayerStore";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState, type RefObject } from "react";
import type { ToolType } from "../Store/MenuStore";
import type { LayerData, ShapeNode, UndoType } from "../Data/LayerData";
import { useBoardStore } from "../Store/BoardStore";
import { findPositionOfNewShape } from "../Utils/NewShapeUtils";

interface DrawHandlersProps {
  stageRef: RefObject<Konva.Stage | null>;
  tool: ToolType;
  allShapes: LayerData;
  activeLayer: string;
  color: string;
  setShowColorPalet: (state: boolean) => void;
  strokeWidth: number;
  addNewUndo: (newAction: UndoType) => void;
  transformerRef: RefObject<Konva.Transformer | null>;
}

export type ActionType = {
  type: "Add";
  shapeDetails: ShapeNode;
  startingPos: { x: number; y: number };
};

export default function useDrawHandlers({
  stageRef,
  tool,
  allShapes,
  activeLayer,
  color,
  setShowColorPalet,
  strokeWidth,
  addNewUndo,
  transformerRef,
}: DrawHandlersProps) {
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);
  const isDrawing = useRef<boolean>(false);
  const addNewShape = useBoardStore((state) => state.addNewShape);
  const setTransformElem = useLayerStore((state) => state.setTransformElem);

  // draw the shape
  function handleMouseClick(e: KonvaEventObject<MouseEvent>) {
    const node = e.target;
    const stage = stageRef.current;
    if (!stage) return;
    const clickedOnEmptyArea = node === e.target.getStage();

    if (clickedOnEmptyArea) {
      setShowColorPalet(false);
      deactiveTransformation();
    }

    // get pointer
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // convert pointer coordinates to stage coordinates
    const x = (pointer.x - stage.x()) / stage.scaleX();
    const y = (pointer.y - stage.y()) / stage.scaleY();

    const newPosition = findPositionOfNewShape(allShapes, activeLayer);

    // switch case
    switch (tool) {
      case "Rectangle":
        {
          const action: ActionType = {
            type: "Add",
            startingPos: { x, y },
            shapeDetails: {
              id: crypto.randomUUID(),
              name: "Rectangle-New",
              type: "shape",
              shapeType: "Rectangle",
              parentId: activeLayer,
              pos: newPosition,
              visibility: true,
              props: {
                x,
                y,
                width: 0,
                height: 0,
                stroke: color,
                fill: undefined,
                strokeWidth: strokeWidth,
              },
            },
          };

          setCurrentAction(action);
        }
        break;

      case "Circle":
        {
          const action: ActionType = {
            type: "Add",
            startingPos: { x, y },
            shapeDetails: {
              id: crypto.randomUUID(),
              name: "Circle-new",
              type: "shape",
              shapeType: "Circle",
              parentId: activeLayer,
              pos: newPosition,
              visibility: true,
              props: {
                x,
                y,
                radius: 0,
                stroke: color,
                fill: undefined,
                strokeWidth: strokeWidth,
              },
            },
          };

          setCurrentAction(action);
        }
        break;

      case "Pen":
        {
          const action: ActionType = {
            type: "Add",
            startingPos: { x, y },
            shapeDetails: {
              id: crypto.randomUUID(),
              name: "Pen-new",
              type: "shape",
              shapeType: "Pen",
              parentId: activeLayer,
              pos: newPosition,
              visibility: true,
              props: {
                points: [x, y, x, y],
                stroke: color,
                strokeWidth: strokeWidth,
              },
            },
          };

          setCurrentAction(action);
        }
        break;

      case "Scribble":
        {
          const action: ActionType = {
            type: "Add",
            startingPos: { x, y },
            shapeDetails: {
              id: crypto.randomUUID(),
              name: "Scribble-new",
              type: "shape",
              shapeType: "Scribble",
              parentId: activeLayer,
              pos: newPosition,
              visibility: true,
              props: {
                points: [x, y],
                stroke: color,
                strokeWidth: strokeWidth,
              },
            },
          };
          setCurrentAction(action);
        }
        break;

      default:
        break;
    }
    isDrawing.current = true;
  }

  function handleMouseMove() {
    // do nothing when not drawing
    if (!isDrawing.current) return;
    if (!stageRef.current) return;
    const pointer = stageRef.current.getPointerPosition();
    if (!pointer) return;

    // convert pointer coordinates to stage coordinates
    const x = (pointer.x - stageRef.current.x()) / stageRef.current.scaleX();
    const y = (pointer.y - stageRef.current.y()) / stageRef.current.scaleY();

    switch (tool) {
      case "Rectangle":
        {
          setCurrentAction((prev) =>
            prev
              ? {
                  ...prev,
                  shapeDetails: {
                    ...prev.shapeDetails,
                    props: {
                      ...prev.shapeDetails.props,
                      width: x - prev.startingPos.x,
                      height: y - prev.startingPos.y,
                    },
                  },
                }
              : prev
          );
        }
        break;

      case "Circle":
        {
          setCurrentAction((prev) =>
            prev
              ? {
                  ...prev,
                  shapeDetails: {
                    ...prev.shapeDetails,
                    props: {
                      ...prev.shapeDetails.props,
                      radius: x - prev.startingPos.x,
                    },
                  },
                }
              : prev
          );
        }
        break;

      case "Pen":
        {
          setCurrentAction((prev) => {
            if (!prev) return prev;
            const updatedPoints = [...(prev?.shapeDetails.props.points || [])];

            updatedPoints[2] = x;
            updatedPoints[3] = y;

            return prev
              ? {
                  ...prev,
                  shapeDetails: {
                    ...prev.shapeDetails,
                    props: {
                      ...prev.shapeDetails.props,
                      points: updatedPoints,
                    },
                  },
                }
              : prev;
          });
        }
        break;

      case "Scribble":
        {
          setCurrentAction((prev) => {
            if (!prev) return prev;
            return prev
              ? {
                  ...prev,
                  shapeDetails: {
                    ...prev.shapeDetails,
                    props: {
                      ...prev.shapeDetails.props,
                      points: [
                        ...(prev.shapeDetails.props.points || []),
                      ].concat([x, y]),
                    },
                  },
                }
              : prev;
          });
        }
        break;

      default:
        break;
    }
  }

  function handleMouseUp() {
    isDrawing.current = false;
    switch (tool) {
      case "Rectangle":
        {
          if (
            currentAction?.shapeDetails.props.width === 0 ||
            currentAction?.shapeDetails.props.height === 0
          ) {
            return;
          }
        }
        if (currentAction) {
          addNewUndo(currentAction);
        }
        break;
      default:
        break;
    }

    const newShapeData = currentAction?.shapeDetails;

    if (!newShapeData) return;
    addNewShape(newShapeData, activeLayer);
    setCurrentAction(null);
  }

  function activateTransformation(e: KonvaEventObject<MouseEvent, Konva.Node>) {
    if (tool !== "Move") return;
    setTransformElem(e.currentTarget.id());
    const currentTarget = e.currentTarget;
    transformerRef.current?.nodes([currentTarget]);
  }

  function deactiveTransformation() {
    transformerRef?.current?.nodes([]);
  }

  // useEffect(() => {
  //   if (currentAction) console.log(currentAction);
  // }, [currentAction]);

  // useEffect(() => {
  //   console.log(allShapes);
  // }, [allShapes]);

  return {
    handleMouseClick,
    handleMouseMove,
    handleMouseUp,
    currentAction,
    activateTransformation,
    deactiveTransformation,
  };
}
