import type { LayerNode } from "../features/layers/type";
import { useSelectionStore } from "../features/selection/selectionStores";
import { useBoardStore } from "../Store/BoardStore";

export default function useLayerMenuHandlers() {
  const allShapes = useBoardStore((state) => state.allShapes);

  const activeId = useSelectionStore((state) => state.activeId);

  const updateShapeNodes = useBoardStore((state) => state.updateShapeNodes);

  function handleUpDown(state: "Up" | "Down") {
    const nodes: Record<string, LayerNode> = allShapes.nodes;
    const node = nodes[activeId];

    if (node.lock) return;
    const targetChildren = getSiblingsNode(node, nodes);
    if (!targetChildren) return;
    // update the position based on the target and selected node
    const siblingsNode = getSiblingsNodeData(nodes, targetChildren);

    const index = siblingsNode.findIndex((node) => node.id === activeId);
    let updatedSiblings: LayerNode[] = [];
    if (state === "Down") {
      updatedSiblings = siblingsNode.slice(index, index + 2);
    } else {
      updatedSiblings = siblingsNode.slice(index - 1, index + 1);
    }

    if (updatedSiblings.length < 2) return;
    const [a, b] = updatedSiblings;
    [a.pos, b.pos] = [b.pos, a.pos];

    updateShapeNodes(updatedSiblings);
  }

  function getSiblingsNode(node: LayerNode, nodes: Record<string, LayerNode>) {
    if (node.parentId === "root") {
      return allShapes.root.children;
    }

    const parentNodeId = node.parentId;

    // check if parentNode is a group
    if (nodes[parentNodeId].type === "group") {
      return nodes[parentNodeId].children;
    }

    if (nodes[parentNodeId].type === "shape") return;
  }

  function getSiblingsNodeData(
    nodes: Record<string, LayerNode>,
    targetChildren: string[],
  ) {
    const result: LayerNode[] = [];

    function getData(nodeId: string) {
      result.push(nodes[nodeId]);
    }

    targetChildren.forEach(getData);

    return result.sort((a, b) => b.pos - a.pos);
  }

  return { handleUpDown };
}
