import { type Dispatch, type SetStateAction } from "react";
import type { LayerData } from "../../Data/LayerData";
import RenderLayerItem from "./RenderLayerItem";

interface LayerPanelProps {
  layerData: LayerData;
  setLayerData: Dispatch<SetStateAction<LayerData>>;
}

const LayerPanel = ({ layerData, setLayerData }: LayerPanelProps) => {
  const toggleVisibility = (id: string) => {
    setLayerData((prev) => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [id]: {
          ...prev.nodes[id],
          visibility: !prev.nodes[id].visibility,
        },
      },
    }));
  };

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
