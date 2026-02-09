import Konva from "konva";
import type { UpdateAction } from "../features/history/type";
import { useLayerStore } from "../features/layers/layerStore";
import { useHistoryStore } from "../features/history/historyStore";

const lastTransform = new WeakMap<
  Konva.Node,
  { rotation: number; scaleX: number; scaleY: number }
>();

export default function useShapeChangeHandlers() {
  const allShapes = useLayerStore((state) => state.allShapes);

  const addNewUndo = useHistoryStore((state) => state.addNewUndo);
  const updateSingleShape = useHistoryStore((state) => state.updateSingleShape);

  function getTransformNode(e: Konva.KonvaEventObject<Event>) {
    const target = e.target;
    if (target instanceof Konva.Transformer) {
      return target.nodes()[0];
    }

    return target;
  }

  function dragShape(
    e: Konva.KonvaEventObject<DragEvent>,
    id: string,
    pointerUp: boolean,
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

    const action: UpdateAction = {
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

  function startTransform(e: Konva.KonvaEventObject<Event>) {
    const node = getTransformNode(e);
    if (!node) return;

    lastTransform.set(node, {
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
    });
  }

  function transformShape(e: Konva.KonvaEventObject<Event>, id: string) {
    const node = getTransformNode(e);
    if (!node) return;

    const prev = lastTransform.get(node);
    if (!prev) return;

    const EPS = 0.001;

    const rotated = Math.abs(node.rotation() - prev.rotation) > EPS;
    const scaled =
      Math.abs(node.scaleX() - prev.scaleX) > EPS ||
      Math.abs(node.scaleY() - prev.scaleY) > EPS;

    const isScale = !rotated && scaled;

    const currentShape = allShapes.nodes[id];
    if (!currentShape || currentShape.type === "group") return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    const newWidth = node.width() * scaleX;
    const newHeight = node.height() * scaleY;

    node.scaleX(1);
    node.scaleY(1);

    if (currentShape.shapeType === "Rectangle") {
      const action: UpdateAction = {
        type: "Update",
        id,
        parentId: currentShape.parentId,
        prev: isScale
          ? {
              width: currentShape.props.width,
              height: currentShape.props.height,
              x: currentShape.props.x,
              y: currentShape.props.y,
            }
          : { rotation: currentShape.props.rotation },
        next: isScale
          ? { width: newWidth, height: newHeight, x: node.x(), y: node.y() }
          : { rotation: node.rotation() },
      };

      addNewUndo(action);
      updateSingleShape(action);
    }

    lastTransform.delete(node);
  }

  function seedTransform(node: Konva.Node) {
    lastTransform.set(node, {
      rotation: node.rotation(),
      scaleX: node.scaleX(),
      scaleY: node.scaleY(),
    });
  }

  return {
    dragShape,
    startTransform,
    transformShape,
    seedTransform,
  };
}
