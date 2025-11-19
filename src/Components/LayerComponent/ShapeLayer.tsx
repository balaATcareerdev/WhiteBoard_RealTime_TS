import { type ShapeNode } from "../../Data/LayerData";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

interface ShapeLayerProps {
  node: ShapeNode;
  toggleVisibility: (id: string) => void;
}

const ShapeLayer = ({ node, toggleVisibility }: ShapeLayerProps) => {
  return (
    <div
      className={`pl-2 bg-gray-200 select-none px-3 py-2 ${
        node.parentId === "root" ? "mb-1" : ""
      }`}
    >
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
        <p className={`text-gray-600 font-medium`}>{node.name}</p>
      </div>
    </div>
  );
};

export default ShapeLayer;
