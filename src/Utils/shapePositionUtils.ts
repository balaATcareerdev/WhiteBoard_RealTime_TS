import type { LayerTree } from "../features/layers/type";

export function findPositionOfNewShape(allShapes: LayerTree, layer: string) {
  const positions: number[] = [];

  function loopGroup(nodeId: string) {
    const node = allShapes.nodes[nodeId];
    if (!node) return;

    if (layer === "root") {
      if (node.parentId === "root") {
        positions.push(node.pos);
      }
    } else {
      if (node.type === "shape" && node.parentId === layer) {
        positions.push(node.pos);
      }

      if (node.type === "group") {
        node.children.forEach(loopGroup);
      }
    }
  }

  allShapes.root.children.forEach(loopGroup);

  return positions.length > 0 ? Math.max(...positions) + 1 : 1;
}
