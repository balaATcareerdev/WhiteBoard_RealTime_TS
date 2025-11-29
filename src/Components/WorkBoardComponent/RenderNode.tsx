import { Circle, Group, Rect } from "react-konva";
import type { GroupNode, LayerData, ShapeNode } from "../../Data/LayerData";

interface RenderNodeProps {
  nodeId: string;
  layerData: LayerData;
}

const RenderNode = ({ nodeId, layerData }: RenderNodeProps) => {
  const node = layerData.nodes[nodeId];
  if (!node) return;

  if (node.type == "shape") {
    const shape = node as ShapeNode;
    switch (shape.shapeType) {
      case "Rectangle":
        return (
          <Rect
            key={shape.id}
            x={shape.props.x}
            y={shape.props.y}
            width={shape.props.width}
            height={shape.props.height}
            fill={shape.props.fill}
            stroke={shape.props.stroke}
            rotation={shape.props.rotation}
            draggable={true}
            visible={shape.visibility}
            strokeWidth={shape.props.strokeWidth}
          />
        );

      case "Circle":
        return (
          <Circle
            key={shape.id}
            x={shape.props.x}
            y={shape.props.y}
            radius={shape.props.radius}
            stroke={shape.props.stroke}
            strokeWidth={shape.props.strokeWidth}
            rotation={shape.props.rotation}
            fill={shape.props.fill}
            draggable={true}
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
      (a, b) => layerData.nodes[a].pos - layerData.nodes[b].pos
    );
    return (
      <>
        <Group key={group.id} visible={node.visibility}>
          {sortedGroupElements.map((childId) => (
            <RenderNode nodeId={childId} layerData={layerData} key={childId} />
          ))}
        </Group>
      </>
    );
  }
  return null;
};

export default RenderNode;
