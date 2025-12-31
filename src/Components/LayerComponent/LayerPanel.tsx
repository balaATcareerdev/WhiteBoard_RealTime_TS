import type { LayerData } from "../../Data/LayerData";
import { useLayerStore } from "../../Store/LayerStore";
import Header from "../CommonComponent/Header";
import Properties from "../PropertiesComponent/Properties";
import ShapeList from "./ShapeList";

interface LayerPanelProps {
  layerData: LayerData;
}

const LayerPanel = ({ layerData }: LayerPanelProps) => {
  const sortedLayerData = [...layerData.root.children].sort((a, b) => {
    return layerData.nodes[b].pos - layerData.nodes[a].pos;
  });

  const activeLayer = useLayerStore((state) => state.activeLayer);

  if (sortedLayerData.length === 0) {
    return (
      <div className="p-5">
        <span className="text-gray-500">
          No layers available. Add shapes to see them listed here.
        </span>
      </div>
    );
  }

  return (
    <div className="select-none h-full flex flex-col">
      {/* Header */}
      <Header title="Layers" />

      {/* Elem */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar py-1">
        <ShapeList sortedLayerData={sortedLayerData} layerData={layerData} />
      </div>

      {/* Properties */}
      {activeLayer !== "root" && (
        <div className="max-h-[40%] min-h-0 overflow-y-auto border-t no-scrollbar">
          <Properties id={activeLayer} />
        </div>
      )}
    </div>
  );
};

export default LayerPanel;
