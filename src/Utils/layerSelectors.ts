import type { LayerTree } from "../features/layers/type";

export const parentGroupVisibility = (allShapes: LayerTree, parentId: string) =>
  allShapes.nodes[parentId]?.visibility;

export const layerToDrawShape = (allShapes: LayerTree, activeLayer: string) => {
  if (activeLayer === "root") {
    return "root";
  }
  const node = allShapes.nodes[activeLayer];
  return node.type === "group" ? node.id : node.parentId;
};
