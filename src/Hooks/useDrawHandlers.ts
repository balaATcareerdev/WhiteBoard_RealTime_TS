import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { useBoardStore } from "../Store/BoardStore";
import { findPositionOfNewShape } from "../Utils/NewShapeUtils";
import { Tools } from "../features/tools/tools";
import useShapeChangeHandlers from "./useShapeChangeHandlers";
import { type AddAction } from "../features/history/type";
import { useSelectionStore } from "../features/selection/selectionStores";
import { useTransformStore } from "../features/transform/transformStore";
import { useLayerTargetStore } from "../features/layers/layerTargetStore";
import { useToolStore } from "../features/tools/toolStore";
import { useStyleStore } from "../features/styles/styleStore";

export default function useDrawHandlers({
  spaceDown = false,
}: {
  spaceDown?: boolean;
} = {}) {
  const [currentAction, setCurrentAction] = useState<AddAction | null>(null);
  const isDrawing = useRef<boolean>(false);
  const addNewShape = useBoardStore((state) => state.addNewShape);
  const setTransformElemId = useTransformStore(
    (state) => state.setTransformElemId,
  );
  const currentTool = useToolStore((state) => state.currentTool);
  const allShapes = useBoardStore((state) => state.allShapes);

  const activeId = useSelectionStore((state) => state.activeId);

  const color = useStyleStore((state) => state.color);
  const toggleColorPalet = useStyleStore((state) => state.toggleColorPalet);
  const strokeWidth = useStyleStore((state) => state.strokeWidth);
  const addNewUndo = useBoardStore((state) => state.addNewUndo);
  const stageRef = useBoardStore((state) => state.stageRef);
  const transformerRef = useBoardStore((state) => state.transformerRef);
  const targetLayerId = useLayerTargetStore((state) => state.targetLayerId);
  const undoStack = useBoardStore((state) => state.undoStack);
  const { seedTransform } = useShapeChangeHandlers();

  useEffect(() => {
    console.log(undoStack);
  }, [undoStack]);

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
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    // convert pointer coordinates to stage coordinates
    const x = (pointer.x - stage.x()) / stage.scaleX();
    const y = (pointer.y - stage.y()) / stage.scaleY();

    const newPosition = findPositionOfNewShape(allShapes, targetLayerId);

    // switch case
    switch (currentTool) {
      case Tools.Rectangle:
        {
          const action: AddAction = {
            type: "Add",
            startingPos: { x, y },
            shapeDetails: {
              id: crypto.randomUUID(),
              name: `${Tools.Rectangle}-New`,
              type: "shape",
              shapeType: "Rectangle",
              parentId: targetLayerId,
              pos: newPosition,
              visibility: true,
              lock: false,
              props: {
                x,
                y,
                width: 0,
                height: 0,
                stroke: color,
                fill: undefined,
                strokeWidth: strokeWidth,
                rotation: 0,
              },
            },
          };

          setCurrentAction(action);
        }
        break;

      case Tools.Circle:
        {
          const action: AddAction = {
            type: "Add",
            startingPos: { x, y },
            shapeDetails: {
              id: crypto.randomUUID(),
              name: `${Tools.Circle}-new`,
              type: "shape",
              shapeType: currentTool,
              parentId: activeId,
              pos: newPosition,
              visibility: true,
              lock: false,
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

      case Tools.Line:
        {
          const action: AddAction = {
            type: "Add",
            startingPos: { x, y },
            shapeDetails: {
              id: crypto.randomUUID(),
              name: `${Tools.Line}-new`,
              type: "shape",
              shapeType: currentTool,
              parentId: activeId,
              pos: newPosition,
              visibility: true,
              lock: false,
              props: {
                rotation: 0,
                points: [x, y, x, y],
                stroke: color,
                strokeWidth: strokeWidth,
              },
            },
          };

          setCurrentAction(action);
        }
        break;

      case Tools.Scribble:
        {
          const action: AddAction = {
            type: "Add",
            startingPos: { x, y },
            shapeDetails: {
              id: crypto.randomUUID(),
              name: `${Tools.Scribble}-new`,
              type: "shape",
              shapeType: currentTool,
              parentId: activeId,
              pos: newPosition,
              visibility: true,
              lock: false,
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
    const pointer = stageRef.current.getPointerPosition();
    if (!pointer) return;

    // convert pointer coordinates to stage coordinates
    const x = (pointer.x - stageRef.current.x()) / stageRef.current.scaleX();
    const y = (pointer.y - stageRef.current.y()) / stageRef.current.scaleY();

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
