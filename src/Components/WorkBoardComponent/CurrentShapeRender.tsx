import { Circle, Rect } from "react-konva";
import type { ShapeNode } from "../../Data/LayerData";

interface CurrentShapeRenderProps {
  shapeDetails?: ShapeNode;
}

const CurrentShapeRender = ({ shapeDetails }: CurrentShapeRenderProps) => {
  if (!shapeDetails) return null;
  console.log(shapeDetails.shapeType);

  switch (shapeDetails.shapeType) {
    case "Rectangle":
      return (
        <Rect
          x={shapeDetails.props.x}
          y={shapeDetails.props.y}
          width={shapeDetails.props.width}
          height={shapeDetails.props.height}
          stroke={shapeDetails.props.stroke}
          strokeWidth={shapeDetails.props.strokeWidth}
          fill={shapeDetails.props.fill}
          visible={shapeDetails.visibility}
        />
      );

    case "Circle": {
      return (
        <Circle
          x={shapeDetails.props.x}
          y={shapeDetails.props.y}
          radius={shapeDetails.props.radius}
          stroke={shapeDetails.props.stroke}
          strokeWidth={shapeDetails.props.strokeWidth}
          fill={shapeDetails.props.fill}
          visible={shapeDetails.visibility}
        />
      );
    }

    default:
      break;
  }
};

export default CurrentShapeRender;
