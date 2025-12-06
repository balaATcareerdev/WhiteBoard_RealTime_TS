import type { LayerData } from "../Data/LayerData";

export const parentGroupVisibility = (allShapes: LayerData, parentId: string) =>
  allShapes.nodes[parentId]?.visibility;

export const layerToDrawShape = (allShapes: LayerData, activeLayer: string) => {
  if (activeLayer === "root") {
    return "root";
  }
  const node = allShapes.nodes[activeLayer];
  return node.type === "group" ? node.id : node.parentId;
};
