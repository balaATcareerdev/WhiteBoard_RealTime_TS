import type { Dispatch, SetStateAction } from "react";
import type { GroupNode, LayerData } from "../../Data/LayerData";
import RenderLayerItem from "./RenderLayerItem";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

interface GroupLayerProps {
  shapeId: string;
  node: GroupNode;
  open: boolean;
  childElements: string[];
  layerData: LayerData;
  setOpen: Dispatch<SetStateAction<boolean>>;
  toggleVisibility: (id: string) => void;
}

const GroupLayer = ({
  shapeId,
  node,
  open,
  childElements,
  layerData,
  setOpen,
  toggleVisibility,
}: GroupLayerProps) => {
  return (
    <div
      key={shapeId}
      className={`p-2 outline-gray-400 outline rounded-sm select-none bg-gray-50 ${
        node.parentId === "root" ? "mb-1" : ""
      }`}
    >
      {/* Root */}
      <div className="flex items-center gap-1">
        <div
          className="p-1 hover:bg-gray-50 rounded-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            toggleVisibility(node.id);
          }}
        >
          {node.visibility ? (
            <FaEye color="#4a5565" />
          ) : (
            <FaEyeSlash color="#4a5565" />
          )}
        </div>
        <span
          onClick={() => setOpen((prev) => !prev)}
          className="font-semibold"
        >
          {node.name}
        </span>
      </div>

      {/* Child */}
      <div className={`${open ? "opacity-100" : "max-h-0 opacity-0"}`}>
        {childElements.map((childId) => (
          <div key={childId}>
            <RenderLayerItem
              shapeId={childId}
              layerData={layerData}
              toggleVisibility={toggleVisibility}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupLayer;
