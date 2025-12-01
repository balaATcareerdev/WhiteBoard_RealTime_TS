import { Circle, Group, Line, Rect } from "react-konva";
import type { GroupNode, LayerData, ShapeNode } from "../../Data/LayerData";
import Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";

interface RenderNodeProps {
  nodeId: string;
  layerData: LayerData;
  activateTransformation: (e: KonvaEventObject<MouseEvent, Konva.Node>) => void;
}

const RenderNode = ({
  nodeId,
  layerData,
  activateTransformation,
}: RenderNodeProps) => {
  const node = layerData.nodes[nodeId];
  if (!node) return;

  if (node.type == "shape") {
    const shape = node as ShapeNode;
    switch (shape.shapeType) {
      case "Rectangle":
        return (
          <Rect
            id={shape.id}
            x={shape.props.x}
            y={shape.props.y}
            width={shape.props.width}
            height={shape.props.height}
            fill={shape.props.fill}
            stroke={shape.props.stroke}
            rotation={shape.props.rotation}
            visible={shape.visibility}
            strokeWidth={shape.props.strokeWidth}
            onClick={(e) => activateTransformation(e)}
          />
        );

      case "Circle":
        return (
          <Circle
            id={shape.id}
            x={shape.props.x}
            y={shape.props.y}
            radius={shape.props.radius}
            stroke={shape.props.stroke}
            strokeWidth={shape.props.strokeWidth}
            rotation={shape.props.rotation}
            fill={shape.props.fill}
            visible={shape.visibility}
            onClick={(e) => activateTransformation(e)}
          />
        );

      case "Pen":
      case "Scribble":
        return (
          <Line
            id={shape.id}
            points={shape.props.points}
            stroke={shape.props.stroke}
            strokeWidth={shape.props.strokeWidth}
            tension={0.5}
            lineCap="round"
            lineJoin="round"
          />
        );

      default:
        return null;
    }
  }

  if (node.type == "group") {
    const group = node as GroupNode;
    const sortedGroupElements = [...group.children].sort(
      (a, b) => layerData.nodes[a].pos - layerData.nodes[b].pos
    );
    return (
      <>
        <Group key={group.id} visible={node.visibility}>
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
