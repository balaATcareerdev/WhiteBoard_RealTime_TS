import type { Dispatch, SetStateAction } from "react";
import type { GroupNode, LayerData } from "../../Data/LayerData";
import RenderLayerItem from "./RenderLayerItem";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { useLayerStore } from "../../Store/LayerStore";
import useDrawHandlers from "../../Hooks/useDrawHandlers";
import { CiFolderOn } from "react-icons/ci";

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
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  const activeLayer = useLayerStore((state) => state.activeLayer);
  const transformElem = useLayerStore((state) => state.transformElem);

  const { deactiveTransformation } = useDrawHandlers();

  return (
    <div
      key={shapeId}
      className={`select-none ${node.parentId === "root" ? "" : "pl-10"}`}
    >
      {/* Root Header */}
      <div
        className={`flex ${
          node.parentId === "root" ? "" : "border-gray-100 border-l-2"
        } items-center justify-between px-1 hover:bg-gray-100 py-1 ${
          activeLayer === node.id ? "bg-blue-50" : ""
        }`}
        onClick={() => {
          setActiveLayer(node.id);
        }}
      >
        <div className="flex items-center">
          {/* Eye */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleVisibility(node.id);
              if (transformElem && node.children.includes(transformElem)) {
                deactiveTransformation();
              }
            }}
          >
            {node.visibility ? (
              <FaEye color="#4a5565" />
            ) : (
              <FaEyeSlash color="#4a5565" />
            )}
          </div>

          {/* Logo and name */}
          <div className={`flex items-center text-lg pl-4 gap-1`}>
            <CiFolderOn />
            <span>{node.name}</span>
          </div>
        </div>

        {/* Right includes the Collapse*/}
        <div onClick={() => setOpen((prev) => !prev)}>
          <FaAngleDown
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
      </div>

      {/* Child */}
      <div
        className={`transition-all duration-200 overflow-hidden ${
          open
            ? "max-h-96 opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        {childElements.map((childId) => (
          <RenderLayerItem
            shapeId={childId}
            layerData={layerData}
            toggleVisibility={toggleVisibility}
            key={childId}
          />
        ))}
      </div>
    </div>
  );
};

export default GroupLayer;
