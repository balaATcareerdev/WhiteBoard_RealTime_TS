import Konva from "konva";
import { useBoardStore } from "../Store/BoardStore";
import type { UpdateType } from "../Data/LayerData";
export default function useShapeChangeHandlers() {
  const allShapes = useBoardStore((state) => state.allShapes);
  const addNewUndo = useBoardStore((state) => state.addNewUndo);
  const updateSingleShape = useBoardStore((state) => state.updateSingleShape);

  function dragShape(
    e: Konva.KonvaEventObject<DragEvent>,
    id: string,
    pointerUp: boolean
  ) {
    const node = e.target;
    const currentShape = allShapes.nodes[id];
    if (!currentShape) return;
    if (currentShape.type === "group") return;
    const updatedShape = {
      ...currentShape,
      props: {
        ...currentShape.props,
        x: node.x(),
        y: node.y(),
      },
    };

    const action: UpdateType = {
      type: "Update",
      id: currentShape.id,
      parentId: currentShape.parentId,
      prev: { x: currentShape.props.x, y: currentShape.props.y },
      next: { x: updatedShape.props.x, y: updatedShape.props.y },
    };

    if (pointerUp) {
      //? update the undo
      addNewUndo(action);
    }

    //? update the shapes
    updateSingleShape(action);
  }

  function transformShape(e: Konva.KonvaEventObject<Event>, id: string) {
    const node = e.target;
    const currentShape = allShapes.nodes[id];
    if (!currentShape) return;
    if (currentShape.type === "group") return;
    if (!currentShape.props.stroke || !currentShape.props.strokeWidth) return;

    // currentValue
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // reset the value
    node.scaleX(1);
    node.scaleY(1);

    switch (currentShape.shapeType) {
      case "Rectangle":
        {
          const action: UpdateType = {
            type: "Update",
            id,
            parentId: currentShape.parentId,
            prev: {
              width: currentShape.props.width,
              height: currentShape.props.height,
              x: currentShape.props.x,
              y: currentShape.props.y,
            },
            next: {
              width: node.width() * scaleX,
              height: node.height() * scaleY,
              x: node.x(),
              y: node.y(),
            },
          };

          addNewUndo(action);
          updateSingleShape(action);
        }
        break;

      default:
        break;
    }
  }

  return {
    dragShape,
    transformShape,
  };
}
