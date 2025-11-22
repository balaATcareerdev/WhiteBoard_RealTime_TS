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
    <div className=" bg-gray-50 shadow-lg h-full p-1 rounded-l-2xl px-2 border-l-2 border-gray-200">
      <h1 className="font-medium text-lg text-gray-700">Layers</h1>
      <hr className="border-gray-500 mt-2 mb-2" />
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
