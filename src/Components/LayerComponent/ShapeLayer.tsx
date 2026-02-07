import useDrawHandlers from "../../hooks/useDrawHandlers";
import Icon from "./Icon";
import { AiTwotoneLock } from "react-icons/ai";
import { AiTwotoneUnlock } from "react-icons/ai";
import { PiEyesFill } from "react-icons/pi";
import { PiSmileyXEyes } from "react-icons/pi";
import { useSelectionStore } from "../../features/selection/selectionStores";
import type { ShapeNode } from "../../features/layers/type";
import { useTransformStore } from "../../features/transform/transformStore";
import { useLayerTargetStore } from "../../features/layers/layerTargetStore";
import { useLayerStore } from "../../features/layers/layerStore";
import {
  layerToDrawShape,
  parentGroupVisibility,
} from "../../Utils/layerSelectors";

interface ShapeLayerProps {
  node: ShapeNode;
  toggleVisibility: (id: string) => void;
}

const ShapeLayer = ({ node, toggleVisibility }: ShapeLayerProps) => {
  const setActive = useSelectionStore((state) => state.setActive);

  const activeId = useSelectionStore((state) => state.activeId);

  const transformElemId = useTransformStore((state) => state.transformELemId);
  const allShapes = useLayerStore((state) => state.allShapes);

  const { activateTrasformationFromList, deactiveTransformation } =
    useDrawHandlers();
  const setTargetLayerId = useLayerTargetStore(
    (state) => state.setTargetLayerId,
  );

  const setLockShape = useLayerStore((state) => state.setLockShape);

  const toggle = useSelectionStore((state) => state.toggle);

  const selectedIds = useSelectionStore((state) => state.selectedIds);

  const onMultiSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(node.id);
    setActive("root");
  };

  return (
    <div
      className={`grid grid-cols-[1fr_30px_30px] cursor-pointer items-center ${
        node.parentId === "root" ? "px-2" : ""
      } ${activeId === node.id ? "bg-blue-50 text-[#155dfc]" : ""}
      ${selectedIds.includes(node.id) ? "bg-red-100 text-red-500" : activeId === node.id ? "bg-blue-50 text-[#155dfc]" : ""}
      my-2 hover:bg-gray-100`}
      onClick={(e) => {
        if (e.shiftKey) {
          onMultiSelect(e);
          return;
        }
        setActive(node.id);
        const layerToDraw = layerToDrawShape(allShapes, node.id);
        setTargetLayerId(layerToDraw);
        if (activeId === node.id) {
          deactiveTransformation();
        } else {
          activateTrasformationFromList(node.id);
        }
      }}
    >
      {/* Left Side */}
      <div className="flex items-center">
        <div className="flex flex-col">
          <span className="text-lg font-montserrat font-medium">
            {node.name.length > 15 ? node.name.slice(0, 15) : node.name}
          </span>
          <span className="text-gray-600">
            {node.shapeType.toLocaleLowerCase()}
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
          if (
            node.parentId === "root" ||
            parentGroupVisibility(allShapes, node.parentId)
          ) {
            toggleVisibility(node.id);
          }
          if (node.id === transformElemId) {
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
  );
};

export default ShapeLayer;
