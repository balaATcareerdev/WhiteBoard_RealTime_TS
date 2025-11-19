import { Group, Rect } from "react-konva";
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
            fill={shape.props.fill || undefined}
            stroke={shape.props.stroke}
            rotation={shape.props.rotation}
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
        <Group
          key={group.id}
          x={group.props.x}
          y={group.props.y}
          rotation={group.props.rotation}
          visible={node.visibility}
        >
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
