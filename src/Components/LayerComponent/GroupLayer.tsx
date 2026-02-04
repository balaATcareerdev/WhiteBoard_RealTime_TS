import type { Dispatch, SetStateAction } from "react";
import { FaAngleDown } from "react-icons/fa";
import useDrawHandlers from "../../Hooks/useDrawHandlers";
import { layerToDrawShape } from "../../Utils/ShapeDataUtils";
import Icon from "./Icon";
import { FcFolder } from "react-icons/fc";
import { AiTwotoneLock } from "react-icons/ai";
import { AiTwotoneUnlock } from "react-icons/ai";
import { PiEyesFill } from "react-icons/pi";
import { PiSmileyXEyes } from "react-icons/pi";

import ShapeList from "./ShapeList";
import { useSelectionStore } from "../../features/selection/selectionStores";
import type { GroupNode, LayerTree } from "../../features/layers/type";
import { useTransformStore } from "../../features/transform/transformStore";
import { useLayerTargetStore } from "../../features/layers/layerTargetStore";
import { useLayerStore } from "../../features/layers/layerStore";

interface GroupLayerProps {
  node: GroupNode;
  open: boolean;
  childElements: string[];
  layerData: LayerTree;
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
  const setActive = useSelectionStore((state) => state.setActive);

  const activeId = useSelectionStore((state) => state.activeId);

  const transformElemId = useTransformStore((state) => state.transformELemId);

  const { deactiveTransformation } = useDrawHandlers();
  const setTargetLayerId = useLayerTargetStore(
    (state) => state.setTargetLayerId,
  );
  const allShapes = useLayerStore((state) => state.allShapes);
  const setLockShape = useLayerStore((state) => state.setLockShape);

  return (
    <div
      className={`select-none py-2 ${node.parentId === "root" ? "p-2" : ""}`}
    >
      {/* Header */}
      <div
        className={`grid grid-cols-[1fr_30px_30px] cursor-pointer hover:bg-gray-100 ${
          activeId === node.id ? "bg-blue-50 text-[#155dfc]" : ""
        }`}
        onClick={() => {
          setActive(node.id);
          const layerToDraw = layerToDrawShape(allShapes, node.id);
          setTargetLayerId(layerToDraw);
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
            if (transformElemId && node.children.includes(transformElemId)) {
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
