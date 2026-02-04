import { useLayerStore } from "../../features/layers/layerStore.ts";
import type { LayerTree } from "../../features/layers/type.ts";
import RenderLayerItem from "./RenderLayerItem.tsx";

interface ShapeListProps {
  sortedLayerData?: string[];
  layerData: LayerTree;
  childElements?: string[];
}

const ShapeList = ({
  sortedLayerData,
  layerData,
  childElements,
}: ShapeListProps) => {
  const toggleVisibility = useLayerStore(
    (state) => state.toggleVisiblityOfLayer,
  );

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
