import type { LayerTree } from "../../features/layers/type";
import { useSelectionStore } from "../../features/selection/selectionStores";
import useDrawHandlers from "../../Hooks/useDrawHandlers";
import { useBoardStore } from "../../Store/BoardStore";
import Header from "../CommonComponent/Header";
import Properties from "../PropertiesComponent/Properties";
import ShapeList from "./ShapeList";

interface LayerPanelProps {
  layerData: LayerTree;
}

const LayerPanel = ({ layerData }: LayerPanelProps) => {
  const sortedLayerData = [...layerData.root.children].sort((a, b) => {
    return layerData.nodes[b].pos - layerData.nodes[a].pos;
  });

  const activeId = useSelectionStore((state) => state.activeId);

  const createGroup = useBoardStore((state) => state.createGroup);

  const selectedIds = useSelectionStore((state) => state.selectedIds);

  const clearSelection = useSelectionStore((state) => state.clearSelection);

  const { deactiveTransformation } = useDrawHandlers();

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
      <div className="border-b border-gray-200 flex items-center gap-2">
        <Header title="Layers" />
        <button
          className="text-lg font-outfit outline outline-[#155dfc] text-[#155dfc] px-2 py-1 rounded-lg cursor-pointer hover:outline-none hover:bg-[#155dfc] hover:text-white active:scale-95 transition-all duration-300 active:bg-blue-500"
          onClick={() => {
            createGroup(selectedIds);
            clearSelection();
            deactiveTransformation();
          }}
        >
          Create Group +
        </button>
      </div>
      {/* Elem */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar py-1">
        <ShapeList sortedLayerData={sortedLayerData} layerData={layerData} />
      </div>
      {/* Properties */}
      {activeId !== "root" && layerData.nodes[activeId] && (
        <div className="max-h-[40%] min-h-0 overflow-y-auto border-t border-gray-300 no-scrollbar">
          <Properties node={layerData.nodes[activeId]} />
        </div>
      )}
    </div>
  );
};

export default LayerPanel;
