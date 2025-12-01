import type { LayerData } from "../Data/LayerData";

export const parentGroupVisibility = (allShapes: LayerData, parentId: string) =>
  allShapes.nodes[parentId]?.visibility;
