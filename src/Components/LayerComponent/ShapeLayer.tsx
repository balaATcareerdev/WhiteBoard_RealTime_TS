import { type ShapeNode } from "../../Data/LayerData";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useLayerStore } from "../../Store/LayerStore";
import { useState, type ChangeEvent } from "react";

interface ShapeLayerProps {
  node: ShapeNode;
  toggleVisibility: (id: string) => void;
}

const ShapeLayer = ({ node, toggleVisibility }: ShapeLayerProps) => {
  const setSelectedLayers = useLayerStore((state) => state.setSelectedLayers);

  const [isRecognized, setIsRecognized] = useState<boolean>(false);

  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);

  const handleSelectLayer = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedLayers(node.id, e.target.checked);
  };

  return (
    <div
      className={`pl-2 bg-gray-50 select-none px-3 py-2 ${
        node.parentId === "root"
          ? "mb-1 outline-gray-400 outline rounded-sm"
          : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div
            className="p-1 hover:bg-gray-50 rounded-full cursor-pointer"
            onClick={() => toggleVisibility(node.id)}
          >
            {node.visibility ? (
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
