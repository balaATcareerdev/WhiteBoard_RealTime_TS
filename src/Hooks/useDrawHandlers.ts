import { useLayerStore } from "./../Store/LayerStore";
import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { useRef, useState } from "react";
import { useMenuStore } from "../Store/MenuStore";
import type { ShapeNode } from "../Data/LayerData";
import { useBoardStore } from "../Store/BoardStore";
import { findPositionOfNewShape } from "../Utils/NewShapeUtils";
import { Tools } from "../constants/ToolConst";

export type ActionType = {
  type: "Add";
  shapeDetails: ShapeNode;
  startingPos: { x: number; y: number };
};

export default function useDrawHandlers({
  spaceDown = false,
}: {
  spaceDown?: boolean;
} = {}) {
  const [currentAction, setCurrentAction] = useState<ActionType | null>(null);
  const isDrawing = useRef<boolean>(false);
  const addNewShape = useBoardStore((state) => state.addNewShape);
  const setTransformElem = useLayerStore((state) => state.setTransformElem);
  const tool = useMenuStore((state) => state.tool);
  const allShapes = useBoardStore((state) => state.allShapes);
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const color = useMenuStore((state) => state.color);
  const setShowColorPalet = useMenuStore((state) => state.setShowColorPalet);
  const strokeWidth = useMenuStore((state) => state.strokeWidth);
  const addNewUndo = useBoardStore((state) => state.addNewUndo);
  const stageRef = useBoardStore((state) => state.stageRef);
  const transformerRef = useBoardStore((state) => state.transformerRef);
  const layerToDraw = useLayerStore((state) => state.layerToDraw);

  // draw the shape
  function handleMouseClick(e: KonvaEventObject<MouseEvent>) {
    if (spaceDown) return;
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

    const newPosition = findPositionOfNewShape(allShapes, layerToDraw);

    // switch case
    switch (tool) {
      case Tools.Rectangle:
        {
          const action: ActionType = {
            type: "Add",
            startingPos: { x, y },
            shapeDetails: {
              id: crypto.randomUUID(),
              name: `${Tools.Rectangle}-New`,
              type: "shape",
              shapeType: "Rectangle",
              parentId: layerToDraw,
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
          console.log(action);

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
              name: `${Tools.Circle}-new`,
              type: "shape",
              shapeType: tool,
              parentId: activeLayer,
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

      case "Line":
        {
          const action: ActionType = {
            type: "Add",
            startingPos: { x, y },
            shapeDetails: {
              id: crypto.randomUUID(),
              name: `${Tools.Line}-new`,
              type: "shape",
              shapeType: tool,
              parentId: activeLayer,
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

      case "Scribble":
        {
          const action: ActionType = {
            type: "Add",
            startingPos: { x, y },
            shapeDetails: {
              id: crypto.randomUUID(),
              name: `${Tools.Scribble}-new`,
              type: "shape",
              shapeType: tool,
              parentId: activeLayer,
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

    switch (tool) {
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
      default:
        break;
    }

    const newShapeData = currentAction?.shapeDetails;

    if (!newShapeData) return;
    addNewShape(newShapeData, layerToDraw);

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

  function activateTrasformationFromList(id: string) {
    const stage = transformerRef.current?.getStage();
    console.log(stage);

    if (!stage) return;
    const node = stage.findOne(`#${id}`);

    console.log(node);

    if (!node) return;
    setTransformElem(id);
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
