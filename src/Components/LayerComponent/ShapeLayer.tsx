import { type ShapeNode } from "../../Data/LayerData";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useLayerStore } from "../../Store/LayerStore";
import { type ChangeEvent } from "react";
import useDrawHandlers from "../../Hooks/useDrawHandlers";
import { parentGroupVisibility } from "../../Utils/ShapeDataUtils";
import { useBoardStore } from "../../Store/BoardStore";
import { RiRectangleLine } from "react-icons/ri";
import { FaRegCircle } from "react-icons/fa";
import { FaPen } from "react-icons/fa6";
import { TbScribble } from "react-icons/tb";
import { Tools } from "../../constants/ToolConst";
import Icon from "./Icon";

interface ShapeLayerProps {
  node: ShapeNode;
  toggleVisibility: (id: string) => void;
}

const ShapeLayer = ({ node, toggleVisibility }: ShapeLayerProps) => {
  const icons = {
    [Tools.Rectangle]: { sym: RiRectangleLine, size: 20 },
    [Tools.Circle]: { sym: FaRegCircle, size: 14 },
    [Tools.Line]: { sym: FaPen, size: 13 },
    [Tools.Scribble]: { sym: TbScribble, size: 18 },
  };

  const setSelectedLayers = useLayerStore((state) => state.setSelectedLayers);

  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  const activeLayer = useLayerStore((state) => state.activeLayer);

  const transformElem = useLayerStore((state) => state.transformElem);
  const allShapes = useBoardStore((state) => state.allShapes);
  const handleSelectLayer = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedLayers(node.id, e.target.checked);
  };
  const { deactiveTransformation } = useDrawHandlers();

  return (
    <div
      className={`select-none ${node.parentId === "root" ? "" : "pl-10"}`}
      onClick={() => setActiveLayer(node.id)}
    >
      <div
        className={`flex justify-between items-center hover:bg-gray-100 py-1 pr-1 ${
          node.parentId === "root" ? "" : "border-gray-100 border-l-2"
        }  ${activeLayer === node.id ? "bg-blue-50" : ""}`}
      >
        {/* left */}
        <div className="flex items-center">
          {/* Eye */}
          <div
            className="p-1 w-6"
            onClick={(e) => {
              e.stopPropagation();
              if (node.id !== activeLayer) return;
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
          >
            {activeLayer === node.id || node.parentId === "root" ? (
              node.visibility &&
              (node.parentId === "root" ||
                parentGroupVisibility(allShapes, node.parentId)) ? (
                <FaEye color="#4a5565" />
              ) : (
                <FaEyeSlash color="#4a5565" />
              )
            ) : null}
          </div>

          {/* Name */}
          <div className="flex items-center pl-4 gap-1">
            <Icon
              Sym={icons[node.shapeType].sym}
              size={icons[node.shapeType].size}
              color="Black"
            />
            <p className="text-lg">{node.name}</p>
          </div>
        </div>
        {/* check */}
        <input
          type="checkbox"
          onChange={handleSelectLayer}
          className="h-4 w-4"
        />
      </div>
    </div>
  );
};

export default ShapeLayer;
