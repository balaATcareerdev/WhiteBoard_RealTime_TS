import { useState } from "react";
import type { LayerData } from "../../Data/LayerData";
import GroupLayer from "./GroupLayer";
import ShapeLayer from "./ShapeLayer";

interface RenderLayerItemProps {
  shapeId: string;
  layerData: LayerData;
  toggleVisibility: (id: string) => void;
}

const RenderLayerItem = ({
  shapeId,
  layerData,
  toggleVisibility,
}: RenderLayerItemProps) => {
  const node = layerData.nodes[shapeId];

  const [open, setOpen] = useState<boolean>(true);
  if (!node) return null;

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
