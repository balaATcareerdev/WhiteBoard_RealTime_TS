import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Tools, type Tool } from "../features/tools/tools";
import { type AddAction } from "../features/history/type";
import { useTransformStore } from "../features/transform/transformStore";
import { useLayerTargetStore } from "../features/layers/layerTargetStore";
import { useToolStore } from "../features/tools/toolStore";
import { useStyleStore } from "../features/styles/styleStore";
import { useLayerStore } from "../features/layers/layerStore";
import { useCanvasStore } from "../features/canvas/canvasStore";
import { useHistoryStore } from "../features/history/historyStore";
import useShapeChangeHandlers from "./useShapeChangeHandlers";
import { findPositionOfNewShape } from "../Utils/shapePositionUtils";
import { useSelectionStore } from "../features/selection/selectionStores";

function getPointer(stage: Konva.Stage) {
  const pointer = stage.getPointerPosition();
  if (!pointer) return null;

  return {
    x: (pointer.x - stage.x()) / stage.scaleX(),
    y: (pointer.y - stage.y()) / stage.scaleY(),
  };
}

function createAddAction(
  tool: Tool,
  x: number,
  y: number,
  newPos: number,
  targetLayerId: string,
  color: string,
  strokeWidth: number,
): AddAction | null {
  const base = {
    type: "Add",
    id: crypto.randomUUID(),
    parentId: targetLayerId,
    pos: newPos,
    visibility: true,
    lock: false,
  };

  switch (tool) {
    case Tools.Rectangle:
      return {
        type: "Add",
        startingPos: { x, y },
        shapeDetails: {
          ...base,
          name: `${Tools.Rectangle}-New`,
          type: "shape",
          shapeType: Tools.Rectangle,
          props: {
            x,
            y,
            width: 0,
            height: 0,
            stroke: color,
            fill: undefined,
            strokeWidth,
            rotation: 0,
          },
        },
      };

    case Tools.Circle:
      return {
        type: "Add",
        startingPos: { x, y },
        shapeDetails: {
          ...base,
          name: `${Tools.Circle}-new`,
          type: "shape",
          shapeType: Tools.Circle,
          props: {
            x,
            y,
            radius: 0,
            stroke: color,
            fill: undefined,
            strokeWidth,
          },
        },
      };

    case Tools.Line:
      return {
        type: "Add",
        startingPos: { x, y },
        shapeDetails: {
          ...base,
          name: `${Tools.Line}-new`,
          type: "shape",
          shapeType: Tools.Line,
          props: {
            rotation: 0,
            points: [x, y, x, y],
            stroke: color,
            strokeWidth,
          },
        },
      };

    case Tools.Scribble:
      return {
        type: "Add",
        startingPos: { x, y },
        shapeDetails: {
          ...base,
          name: `${Tools.Scribble}-new`,
          type: "shape",
          shapeType: Tools.Scribble,
          props: {
            points: [x, y, x, y],
            stroke: color,
            strokeWidth,
          },
        },
      };

    default:
      return null;
  }
}

export default function useDrawHandlers({
  spaceDown = false,
}: {
  spaceDown?: boolean;
} = {}) {
  const [currentAction, setCurrentAction] = useState<AddAction | null>(null);
  const isDrawing = useRef<boolean>(false);
  const addNewShape = useLayerStore((state) => state.addNewShape);
  const setTransformElemId = useTransformStore(
    (state) => state.setTransformElemId,
  );
  const currentTool = useToolStore((state) => state.currentTool);
  const allShapes = useLayerStore((state) => state.allShapes);

  const color = useStyleStore((state) => state.color);
  const toggleColorPalet = useStyleStore((state) => state.toggleColorPalet);
  const strokeWidth = useStyleStore((state) => state.strokeWidth);
  const addNewUndo = useHistoryStore((state) => state.addNewUndo);
  const stageRef = useCanvasStore((state) => state.stageRef);
  const transformerRef = useCanvasStore((state) => state.transformerRef);
  const targetLayerId = useLayerTargetStore((state) => state.targetLayerId);
  const undoStack = useHistoryStore((state) => state.undoStack);
  const setActiveId = useSelectionStore((state) => state.setActive);
  const { seedTransform } = useShapeChangeHandlers();
  const redoStack = useHistoryStore((state) => state.redoStack);

  useEffect(() => {
    console.log(undoStack);
  }, [undoStack]);

  useEffect(() => {
    console.log("Redo Stack", redoStack);
  }, [redoStack]);

  // draw the shape
  function handleMouseClick(e: KonvaEventObject<MouseEvent>) {
    if (spaceDown) return;
    const node = e.target;
    const stage = stageRef.current;
    if (!stage) return;
    const clickedOnEmptyArea = node === e.target.getStage();

    if (clickedOnEmptyArea) {
      toggleColorPalet(false);
      deactiveTransformation();
    }

    // get pointer
    const pointer = getPointer(stage);
    if (!pointer) return;

    // convert pointer coordinates to stage coordinates
    const { x, y } = pointer;

    const newPosition = findPositionOfNewShape(allShapes, targetLayerId);

    // switch case
    switch (currentTool) {
      case Tools.Rectangle:
        {
          const action = createAddAction(
            Tools.Rectangle,
            x,
            y,
            newPosition,
            targetLayerId,
            color,
            strokeWidth,
          );
          setCurrentAction(action);
        }
        break;

      case Tools.Circle:
        {
          const action = createAddAction(
            Tools.Circle,
            x,
            y,
            newPosition,
            targetLayerId,
            color,
            strokeWidth,
          );
          setCurrentAction(action);
        }
        break;

      case Tools.Line:
        {
          const action = createAddAction(
            Tools.Line,
            x,
            y,
            newPosition,
            targetLayerId,
            color,
            strokeWidth,
          );

          setCurrentAction(action);
        }
        break;

      case Tools.Scribble:
        {
          const action = createAddAction(
            Tools.Scribble,
            x,
            y,
            newPosition,
            targetLayerId,
            color,
            strokeWidth,
          );
          setCurrentAction(action);
        }
        break;

      default:
        break;
    }
    isDrawing.current = true;
  }

  function handleMouseMove() {
    if (spaceDown) return;
    // do nothing when not drawing
    if (!isDrawing.current) return;
    if (!stageRef.current) return;

    const stage = stageRef.current;
    if (!stage) return;

    const pointer = getPointer(stage);
    if (!pointer) return;

    // convert pointer coordinates to stage coordinates
    const { x, y } = pointer;

    switch (currentTool) {
      case Tools.Rectangle:
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
              : prev,
          );
        }
        break;

      case Tools.Circle:
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
              : prev,
          );
        }
        break;

      case Tools.Line:
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

      case Tools.Scribble:
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
    if (spaceDown) return;
    isDrawing.current = false;
    switch (currentTool) {
      case Tools.Rectangle:
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

      case "Circle":
        {
          if (currentAction?.shapeDetails.props.radius === 0) {
            return;
          }
        }
        if (currentAction) {
          addNewUndo(currentAction);
        }
        break;

      case "Line":
      case "Scribble": {
        if (currentAction) {
          addNewUndo(currentAction);
        }
        break;
      }

      default:
        break;
    }

    const newShapeData = currentAction?.shapeDetails;

    if (!newShapeData) return;
    addNewShape(newShapeData, targetLayerId);
    setActiveId(newShapeData.id);

    setCurrentAction(null);
  }

  function activateTransformation(e: KonvaEventObject<MouseEvent, Konva.Node>) {
    if (currentTool !== Tools.Move) return;
    setTransformElemId(e.currentTarget.id());
    const currentTarget = e.currentTarget;
    transformerRef.current?.nodes([currentTarget]);
  }

  function deactiveTransformation() {
    transformerRef?.current?.nodes([]);
  }

  function activateTrasformationFromList(id: string) {
    const stage = transformerRef.current?.getStage();

    if (!stage) return;

    const node = stage.findOne(`#${id}`);
    console.log(node);

    if (!node) return;

    seedTransform(node);

    setTransformElemId(id);
    transformerRef.current?.nodes([node]);
  }

  return {
    handleMouseClick,
    handleMouseMove,
    handleMouseUp,
    currentAction,
    activateTransformation,
    deactiveTransformation,
    activateTrasformationFromList,
  };
}
