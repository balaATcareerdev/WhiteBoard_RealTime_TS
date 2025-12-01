import { type ShapeNode } from "../../Data/LayerData";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useLayerStore } from "../../Store/LayerStore";
import { useState, type ChangeEvent } from "react";
import useDrawHandlers from "../../Hooks/useDrawHandlers";
import { parentGroupVisibility } from "../../Utils/ShapeDataUtils";
import { useBoardStore } from "../../Store/BoardStore";

interface ShapeLayerProps {
  node: ShapeNode;
  toggleVisibility: (id: string) => void;
}

const ShapeLayer = ({ node, toggleVisibility }: ShapeLayerProps) => {
  const setSelectedLayers = useLayerStore((state) => state.setSelectedLayers);

  const [isRecognized, setIsRecognized] = useState<boolean>(false);

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
      className={`pl-2 ${
        activeLayer === node.parentId && activeLayer !== "root"
          ? "bg-blue-200"
          : "bg-gray-50"
      } transition duration-300 ease-in-out select-none px-3 py-2 ${
        node.parentId === "root"
          ? "mb-1 outline-gray-400 outline rounded-sm"
          : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div
            className="p-1 hover:bg-gray-50 rounded-full cursor-pointer"
            onClick={() => {
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
            {node.visibility &&
            (node.parentId === "root" ||
              parentGroupVisibility(allShapes, node.parentId)) ? (
              <FaEye color="#4a5565" />
            ) : (
              <FaEyeSlash color="#4a5565" />
            )}
          </div>
          <p
            onClick={() => {
              setIsRecognized(true);
              if (node.parentId === "root") {
                setActiveLayer("root");
              } else {
                setActiveLayer(node.parentId);
              }
            }}
            className={`text-gray-600 ${
              !isRecognized ? "font-bold" : "font-medium"
            } `}
          >
            {node.name}
          </p>
        </div>
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
