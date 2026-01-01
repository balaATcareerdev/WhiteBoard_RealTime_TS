import { Circle, Line, Rect } from "react-konva";
import type { ShapeNode } from "../../Data/LayerData";
import { Tools } from "../../constants/ToolConst";

interface CurrentShapeRenderProps {
  shapeDetails?: ShapeNode;
}

const CurrentShapeRender = ({ shapeDetails }: CurrentShapeRenderProps) => {
  if (!shapeDetails) return null;

  switch (shapeDetails.shapeType) {
    case Tools.Rectangle:
      return (
        <Rect
          x={shapeDetails.props.x}
          y={shapeDetails.props.y}
          width={shapeDetails.props.width}
          height={shapeDetails.props.height}
          stroke={shapeDetails.props.stroke}
          strokeWidth={shapeDetails.props.strokeWidth}
          fill={shapeDetails.props.fill}
          fillEnabled={!!shapeDetails.props.fill}
          strokeEnabled={!!shapeDetails.props.stroke}
          visible={shapeDetails.visibility}
        />
      );

    case Tools.Circle: {
      return (
        <Circle
          x={shapeDetails.props.x}
          y={shapeDetails.props.y}
          radius={shapeDetails.props.radius}
          stroke={shapeDetails.props.stroke}
          strokeWidth={shapeDetails.props.strokeWidth}
          fill={shapeDetails.props.fill}
          visible={shapeDetails.visibility}
          fillEnabled={!!shapeDetails.props.fill}
          strokeEnabled={!!shapeDetails.props.stroke}
        />
      );
    }

    case Tools.Line:
    case Tools.Scribble:
      return (
        <Line
          points={shapeDetails.props.points}
          stroke={shapeDetails.props.stroke}
          strokeWidth={shapeDetails.props.strokeWidth}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
        />
      );

    default:
      break;
  }
};

export default CurrentShapeRender;
