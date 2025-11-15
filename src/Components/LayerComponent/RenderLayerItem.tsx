import { useState } from "react";
import type { LayerData } from "../../Data/LayerData";
import { FaChevronDown } from "react-icons/fa";

interface RenderLayerItemProps {
  shapeId: string;
  layerData: LayerData;
}

const RenderLayerItem = ({ shapeId, layerData }: RenderLayerItemProps) => {
  const node = layerData.nodes[shapeId];

  const [open, setOpen] = useState(false);

  if (node.type == "group") {
    const sortedGroupElem = node.children.sort((a, b) => {
      const nodeA = layerData.nodes[a];
      const nodeB = layerData.nodes[b];

      return nodeB.pos - nodeA.pos;
    });
    return (
      <div
        className="pl-2 w-full bg-gray-100 py-1 rounded-sm select-none"
        key={shapeId}
      >
        {/* Root Name */}
        <div className="font-bold text-gray-700 p-1 flex items-center gap-2 cursor-pointer">
          <span>{node.name}</span>
          <div
            className={`p-1 rounded-full hover:bg-gray-300 flex items-center justify-center overflow-hidden transition-all duration-300 ease-in-out`}
            onClick={() => setOpen((prev) => !prev)}
          >
            <FaChevronDown />
          </div>
        </div>

        {/* Child Name */}
        <div className={`${open ? "opacity-100" : "max-h-0 opacity-0"}`}>
          {sortedGroupElem.map((childId) => {
            return (
              <div className="pl-2" key={childId}>
                <RenderLayerItem shapeId={childId} layerData={layerData} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (node.type == "shape") {
    return (
      <div
        className={`pl-2 bg-gray-100 rounded-sm select-none ${
          node.parentId == "root" ? "mt-1 mb-1" : ""
        }`}
        key={shapeId}
      >
        <p
          className={`${
            node.parentId == "root"
              ? "text-gray-700 rounded-sm font-bold p-1"
              : "font-semibold text-gray-500"
          }`}
        >
          {node.name}
        </p>
      </div>
    );
  }
};

export default RenderLayerItem;
