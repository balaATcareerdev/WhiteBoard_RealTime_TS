import type { LayerData } from "../../Data/LayerData.ts";
import { useBoardStore } from "../../Store/BoardStore.ts";
import RenderLayerItem from "./RenderLayerItem.tsx";

interface ShapeListProps {
  sortedLayerData?: string[];
  layerData: LayerData;
  childElements?: string[];
}

const ShapeList = ({
  sortedLayerData,
  layerData,
  childElements,
}: ShapeListProps) => {
  const toggleVisibility = useBoardStore((state) => state.toggleVisibility);

  console.log(childElements);
  return (
    <div>
      {sortedLayerData &&
        sortedLayerData.map((childId: string) => (
          <RenderLayerItem
            toggleVisibility={toggleVisibility}
            shapeId={childId}
            layerData={layerData}
            key={childId}
          />
        ))}

      {childElements &&
        childElements.map((childId) => (
          <RenderLayerItem
            shapeId={childId}
            layerData={layerData}
            toggleVisibility={toggleVisibility}
            key={childId}
          />
        ))}
    </div>
  );
};

export default ShapeList;
