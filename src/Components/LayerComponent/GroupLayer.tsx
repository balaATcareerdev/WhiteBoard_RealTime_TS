import type { Dispatch, SetStateAction } from "react";
import type { GroupNode, LayerData } from "../../Data/LayerData";
import RenderLayerItem from "./RenderLayerItem";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { useLayerStore } from "../../Store/LayerStore";
import useDrawHandlers from "../../Hooks/useDrawHandlers";

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
      className={`p-2  ${
        activeLayer === node.id
          ? "outline-blue-700 outline-2 bg-blue-200"
          : "outline-gray-400 outline bg-gray-50"
      }  rounded-sm select-none transition-colors duration-300 ease-in-out  ${
        node.parentId === "root" ? "mb-1" : ""
      }`}
    >
      {/* Root */}
      <div
        onClick={() => {
          console.log(node.id);
          setActiveLayer(node.id);
        }}
        className={`flex items-center justify-between gap-1 `}
      >
        <div className="flex items-center">
          <div
            className="p-1 hover:bg-gray-50 rounded-full cursor-pointer"
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
          <span className="font-semibold">{node.name}</span>
        </div>
        <div onClick={() => setOpen((prev) => !prev)}>
          <FaAngleDown
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>
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
