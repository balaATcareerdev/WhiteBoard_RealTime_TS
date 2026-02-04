import { useState } from "react";
import GroupLayer from "./GroupLayer";
import ShapeLayer from "./ShapeLayer";
import type { LayerTree } from "../../features/layers/type";

interface RenderLayerItemProps {
  shapeId: string;
  layerData: LayerTree;
  toggleVisibility: (id: string) => void;
}

const RenderLayerItem = ({
  shapeId,
  layerData,
  toggleVisibility,
}: RenderLayerItemProps) => {
  const node = layerData.nodes[shapeId];

  const [open, setOpen] = useState<boolean>(true);
  if (!node) return;

  if (node.type == "group") {
    const sortedGroupElem = node.children.sort((a, b) => {
      const nodeA = layerData.nodes[a];
      const nodeB = layerData.nodes[b];

      return nodeB.pos - nodeA.pos;
    });
    return (
      <GroupLayer
        node={node}
        open={open}
        childElements={sortedGroupElem}
        layerData={layerData}
        setOpen={setOpen}
        toggleVisibility={toggleVisibility}
      />
    );
  }

  if (node.type == "shape") {
    return <ShapeLayer node={node} toggleVisibility={toggleVisibility} />;
  }
};

export default RenderLayerItem;
