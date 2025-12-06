import type { LayerData } from "../../Data/LayerData";
import RenderLayerItem from "./RenderLayerItem";
import { useBoardStore } from "../../Store/BoardStore";

interface LayerPanelProps {
  layerData: LayerData;
}

const LayerPanel = ({ layerData }: LayerPanelProps) => {
  const toggleVisibility = useBoardStore((state) => state.toggleVisibility);

  const sortedLayerData = [...layerData.root.children].sort((a, b) => {
    return layerData.nodes[b].pos - layerData.nodes[a].pos;
  });

  return (
    <div className="p-1 overflow-y-auto flex-1 min-h-0 scroll-hide">
      <h1 className="font-medium text-lg text-gray-700">Layers</h1>
      <hr className="border-gray-200 mt-2 mb-2" />
      {sortedLayerData.map((childId) => (
        <RenderLayerItem
          toggleVisibility={toggleVisibility}
          shapeId={childId}
          layerData={layerData}
          key={childId}
        />
      ))}
    </div>
  );
};

export default LayerPanel;
