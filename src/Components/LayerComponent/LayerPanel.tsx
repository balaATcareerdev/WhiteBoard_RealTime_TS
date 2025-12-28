import type { LayerData } from "../../Data/LayerData";
import ShapeList from "./ShapeList";

interface LayerPanelProps {
  layerData: LayerData;
}

const LayerPanel = ({ layerData }: LayerPanelProps) => {
  const sortedLayerData = [...layerData.root.children].sort((a, b) => {
    return layerData.nodes[b].pos - layerData.nodes[a].pos;
  });

  return (
    <div className="select-none">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <h1 className="text-xl font-semibold">Layers</h1>
      </div>

      {/* Elem */}
      <ShapeList sortedLayerData={sortedLayerData} layerData={layerData} />
    </div>
  );
};

export default LayerPanel;
