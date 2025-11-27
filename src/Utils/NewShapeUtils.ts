import type { LayerData } from "../Data/LayerData";

export function findPositionOfNewShape(
  shapeName: string,
  allShapes: LayerData,
  layer: string
) {
  const result: number[] = [];

  function loopGroup(nodeId: string) {
    if (layer === "root") {
      if (allShapes.nodes[nodeId].parentId === "root") {
        result.push(allShapes.nodes[nodeId].pos);
      }
    } else {
      if (
        allShapes.nodes[nodeId].type === "shape" &&
        allShapes.nodes[nodeId].shapeType === shapeName &&
        allShapes.nodes[nodeId].parentId === layer
      ) {
        result.push(allShapes.nodes[nodeId].pos);
      }

      if (allShapes.nodes[nodeId].type === "group") {
        allShapes.nodes[nodeId].children.forEach(loopGroup);
      }
    }
  }

  allShapes.root.children.forEach(loopGroup);

  return Math.max(...result) + 1;
}
