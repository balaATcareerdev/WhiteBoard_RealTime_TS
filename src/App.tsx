import { useEffect } from "react";
import LayerPanel from "./Components/LayerComponent/LayerPanel";
import Menu from "./Components/ToolBarComponent/Menu";
import Tools from "./Components/ToolBarComponent/Tools";
import WorkBoard from "./Components/WorkBoardComponent/WorkBoard";
import { useLayerStore } from "./features/layers/layerStore";

const App = () => {
  const layerData = useLayerStore((state) => state.allShapes);

  useEffect(() => {
    console.log(layerData);
  }, [layerData]);

  return (
    <div className="font-outfit min-h-screen h-screen flex flex-col overflow-hidden">
      {/* menu */}
      <div className="w-full p-1">
        <Menu />
      </div>
      {/* WorkSpace */}
      <div className="flex flex-1 min-h-0">
        <div>
          <Tools />
        </div>

        <div className="flex-1 relative overflow-hidden">
          <WorkBoard layerData={layerData} />
        </div>

        {/* layer panel */}
        <div className="w-1/4 flex flex-col min-h-0 border-l border-gray-300">
          <LayerPanel layerData={layerData} />
        </div>
      </div>
    </div>
  );
};

export default App;
