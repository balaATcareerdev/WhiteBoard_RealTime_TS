import { type ShapeNode } from "../../Data/LayerData";
import { useLayerStore } from "../../Store/LayerStore";
import useDrawHandlers from "../../Hooks/useDrawHandlers";
import {
  layerToDrawShape,
  parentGroupVisibility,
} from "../../Utils/ShapeDataUtils";
import { useBoardStore } from "../../Store/BoardStore";
import Icon from "./Icon";
import { AiTwotoneLock } from "react-icons/ai";
import { AiTwotoneUnlock } from "react-icons/ai";
import { PiEyesFill } from "react-icons/pi";
import { PiSmileyXEyes } from "react-icons/pi";

interface ShapeLayerProps {
  node: ShapeNode;
  toggleVisibility: (id: string) => void;
}

const ShapeLayer = ({ node, toggleVisibility }: ShapeLayerProps) => {
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  const activeLayer = useLayerStore((state) => state.activeLayer);

  const transformElem = useLayerStore((state) => state.transformElem);
  const allShapes = useBoardStore((state) => state.allShapes);

  const { activateTrasformationFromList, deactiveTransformation } =
    useDrawHandlers();
  const setLayerToDraw = useLayerStore((state) => state.setLayerToDraw);

  const setLockShape = useBoardStore((state) => state.setLockShape);

  const setSelectedLayers = useLayerStore((state) => state.setSelectedLayers);

  const selectedLayers = useLayerStore((state) => state.selectedLayers);

  const onMultiSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLayers(node.id, !selectedLayers.includes(node.id));
    setActiveLayer("root");
  };

  return (
    <div
      className={`grid grid-cols-[1fr_30px_30px] cursor-pointer items-center ${
        node.parentId === "root" ? "px-2" : ""
      } ${activeLayer === node.id ? "bg-blue-50 text-[#155dfc]" : ""}
      ${selectedLayers.includes(node.id) ? "bg-red-100 text-red-500" : activeLayer === node.id ? "bg-blue-50 text-[#155dfc]" : ""}
      my-2 hover:bg-gray-100`}
      onClick={(e) => {
        if (e.shiftKey) {
          console.log("Shift Key Pressed");
          onMultiSelect(e);
          return;
        }
        setActiveLayer(node.id);
        const layerToDraw = layerToDrawShape(allShapes, node.id);
        setLayerToDraw(layerToDraw);
        if (activeLayer === node.id) {
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
          if (node.id === transformElem) {
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
