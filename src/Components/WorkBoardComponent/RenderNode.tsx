import { Circle, Group, Line, Rect } from "react-konva";
import Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import useShapeChangeHandlers from "../../hooks/useShapeChangeHandlers";
import { useToolStore } from "../../features/tools/toolStore";
import { Tools } from "../../features/tools/tools";
import type {
  GroupNode,
  LayerTree,
  ShapeNode,
} from "../../features/layers/type";

interface RenderNodeProps {
  nodeId: string;
  layerData: LayerTree;
  activateTransformation: (e: KonvaEventObject<MouseEvent, Konva.Node>) => void;
}

const RenderNode = ({
  nodeId,
  layerData,
  activateTransformation,
}: RenderNodeProps) => {
  const currentTool = useToolStore((state) => state.currentTool);

  const { dragShape, transformShape, startTransform } =
    useShapeChangeHandlers();

  const node = layerData.nodes[nodeId];
  if (!node) return;

  if (node.type == "shape") {
    const shape = node as ShapeNode;
    switch (shape.shapeType) {
      case Tools.Rectangle:
        return (
          <Rect
            id={shape.id}
            x={shape.props.x}
            y={shape.props.y}
            width={shape.props.width}
            height={shape.props.height}
            fill={shape.props.fill}
            fillEnabled={!!shape.props.fill}
            stroke={shape.props.stroke}
            strokeEnabled={!!shape.props.stroke}
            rotation={shape.props.rotation}
            visible={shape.visibility}
            strokeWidth={shape.props.strokeWidth}
            draggable={currentTool === Tools.Move}
            onDragEnd={(e) => dragShape(e, shape.id, true)}
            onClick={(e) => activateTransformation(e)}
            onTransformStart={(e) => startTransform(e)}
            onTransformEnd={(e) => transformShape(e, shape.id)}
          />
        );

      case Tools.Circle:
        return (
          <Circle
            id={shape.id}
            x={shape.props.x}
            y={shape.props.y}
            radius={shape.props.radius}
            stroke={shape.props.stroke}
            strokeWidth={shape.props.strokeWidth}
            strokeEnabled={!!shape.props.stroke}
            rotation={shape.props.rotation}
            fill={shape.props.fill}
            fillEnabled={!!shape.props.fill}
            visible={shape.visibility}
            draggable={currentTool === Tools.Move}
            onDragEnd={(e) => dragShape(e, shape.id, true)}
            onClick={(e) => activateTransformation(e)}
          />
        );

      case Tools.Line:
      case Tools.Scribble:
        return (
          <Line
            id={shape.id}
            points={shape.props.points}
            stroke={shape.props.stroke}
            strokeWidth={shape.props.strokeWidth}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
            visible={shape.visibility}
          />
        );

      default:
        return null;
    }
  }

  if (node.type == "group") {
    const group = node as GroupNode;
    const sortedGroupElements = [...group.children].sort(
      (a, b) => layerData.nodes[a].pos - layerData.nodes[b].pos,
    );
    return (
      <>
        <Group key={group.id} visible={node.visibility} listening>
          {sortedGroupElements.map((childId) => (
            <RenderNode
              nodeId={childId}
              layerData={layerData}
              key={childId}
              activateTransformation={activateTransformation}
            />
          ))}
        </Group>
      </>
    );
  }
  return null;
};

export default RenderNode;
