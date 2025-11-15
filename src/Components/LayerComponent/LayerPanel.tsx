import RenderLayerItem from "./RenderLayerItem";
import { dummyLayerData } from "../../Data/LayerData";

const LayerPanel = () => {
  const sortedLayerData = [...dummyLayerData.root.children].sort((a, b) => {
    const nodeA = dummyLayerData.nodes[a];
    const nodeB = dummyLayerData.nodes[b];

    const posA = nodeA.pos || 0;
    const posB = nodeB.pos || 0;

    return posB - posA;
  });

  return (
    <div className=" bg-gray-50 shadow-lg h-full p-1 rounded-l-2xl px-2 border-l-2 border-gray-200">
      <h1 className="font-medium text-lg text-gray-700">Layers</h1>
      <hr className="border-gray-500 mt-2 mb-2" />
      {sortedLayerData.map((childId) => (
        <RenderLayerItem
          shapeId={childId}
          layerData={dummyLayerData}
          key={childId}
        />
      ))}
    </div>
  );
};

export default LayerPanel;
