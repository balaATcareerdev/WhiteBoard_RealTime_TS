import { useState } from "react";
import LayerPanel from "./Components/LayerComponent/LayerPanel";
import Menu from "./Components/ToolBarComponent/Menu";
import Tools from "./Components/ToolBarComponent/Tools";
import WorkBoard from "./Components/WorkBoardComponent/WorkBoard";
import { dummyLayerData, type LayerData } from "./Data/LayerData";

const App = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [layerData, setLayerData] = useState<LayerData>(dummyLayerData);

  return (
    <div className="font-outfit min-h-[100vh] h-[100vh] overflow-hidden flex flex-col relative">
      {/* menu */}
      <div className="w-full p-1">
        <Menu setOpenMenu={setOpenMenu} openMenu={openMenu} />
        <div
          className={`overflow-hidden transition-all duration-300 ${
            openMenu
              ? "max-h-40 opacity-100 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <Tools />
        </div>
      </div>
      {/* WorkSpace */}
      <div className="flex flex-1">
        <div className="flex-1 relative overflow-hidden">
          <WorkBoard layerData={layerData} />
        </div>
        <div className="w-1/4">
          <LayerPanel layerData={layerData} setLayerData={setLayerData} />
        </div>
      </div>
    </div>
  );
};

export default App;
