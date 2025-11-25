import type { LayerData } from "../Data/LayerData";

export function findPositionOfNewShape(
  shapeName: string,
  allShapes: LayerData
) {
  const result: number[] = [];

  function loopGroup(nodeId: string) {
    if (
      allShapes.nodes[nodeId].type === "shape" &&
      allShapes.nodes[nodeId].shapeType === shapeName
    ) {
      result.push(allShapes.nodes[nodeId].pos);
    }

    if (allShapes.nodes[nodeId].type === "group") {
      allShapes.nodes[nodeId].children.forEach(loopGroup);
    }
  }

  allShapes.root.children.forEach(loopGroup);

  return Math.max(...result) + 1;
}
