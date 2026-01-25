import type { Dispatch, SetStateAction } from "react";
import type { GroupNode, LayerData } from "../../Data/LayerData";
import { FaAngleDown } from "react-icons/fa";
import { useLayerStore } from "../../Store/LayerStore";
import useDrawHandlers from "../../Hooks/useDrawHandlers";
import { layerToDrawShape } from "../../Utils/ShapeDataUtils";
import { useBoardStore } from "../../Store/BoardStore";
import Icon from "./Icon";
import { FcFolder } from "react-icons/fc";
import { AiTwotoneLock } from "react-icons/ai";
import { AiTwotoneUnlock } from "react-icons/ai";
import { PiEyesFill } from "react-icons/pi";
import { PiSmileyXEyes } from "react-icons/pi";

import ShapeList from "./ShapeList";

interface GroupLayerProps {
  node: GroupNode;
  open: boolean;
  childElements: string[];
  layerData: LayerData;
  setOpen: Dispatch<SetStateAction<boolean>>;
  toggleVisibility: (id: string) => void;
}

const GroupLayer = ({
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
  const setLayerToDraw = useLayerStore((state) => state.setLayerToDraw);
  const allShapes = useBoardStore((state) => state.allShapes);
  const setLockShape = useBoardStore((state) => state.setLockShape);

  return (
    <div
      className={`select-none py-2 ${node.parentId === "root" ? "p-2" : ""}`}
    >
      {/* Header */}
      <div
        className={`grid grid-cols-[1fr_30px_30px] cursor-pointer hover:bg-gray-100 ${
          activeLayer === node.id ? "bg-blue-50 text-[#155dfc]" : ""
        }`}
        onClick={() => {
          setActiveLayer(node.id);
          const layerToDraw = layerToDrawShape(allShapes, node.id);
          setLayerToDraw(layerToDraw);
        }}
      >
        {/* Left Side Content */}
        <div className="flex items-center">
          <div onClick={() => setOpen((prev) => !prev)}>
            <FaAngleDown
              className={`transition-transform duration-200 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
          <div className="flex items-center">
            <Icon Sym={FcFolder} size={25} isHover={false} />
            <span className="text-lg font-montserrat font-medium">
              {node.name.length > 10
                ? node.name.slice(0, 10) + "..."
                : node.name}
            </span>
          </div>
        </div>

        {/* Right Side */}
        <Icon
          Sym={node.visibility ? PiEyesFill : PiSmileyXEyes}
          size={20}
          color="#000000"
          isHover={true}
          opFunc={(e) => {
            e.stopPropagation();
            toggleVisibility(node.id);
            if (transformElem && node.children.includes(transformElem)) {
              deactiveTransformation();
            }
          }}
        />
        <Icon
          Sym={node.lock ? AiTwotoneLock : AiTwotoneUnlock}
          size={20}
          color="#000000"
          isHover={true}
          opFunc={(e) => {
            e.stopPropagation();
            setLockShape(node.id);
          }}
        />
      </div>

      {/* CHildren */}
      <div
        className={`transition-all duration-200 overflow-hidden pl-4 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <ShapeList childElements={childElements} layerData={layerData} />
      </div>
    </div>
  );
};

export default GroupLayer;
