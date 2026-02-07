import type { LayerNode } from "../features/layers/type";

export function getAncestorsOfShape(
  id: string,
  nodes: Record<string, LayerNode>,
  currentAncestors: string[] = [],
) {
  const node = nodes[id];
  if (!node) return [];

  const parentId = node.parentId;
  currentAncestors.push(parentId);
  if (parentId !== "root") {
    return getAncestorsOfShape(parentId, nodes, currentAncestors);
  } else {
    return currentAncestors;
  }
}

export function getDestinationLayer(ancestorsList: string[][]) {
  const result = ancestorsList.map((ancestors) => ancestors.length);
  const index = result.indexOf(Math.min(...result));
  const target = ancestorsList[index];
  const commonArrays: string[] = [];
  target.map((step) => {
    if (ancestorsList.every((ancestors) => ancestors.includes(step))) {
      commonArrays.push(step);
    }
  });

  return commonArrays.length ? commonArrays[0] : "root";
}
