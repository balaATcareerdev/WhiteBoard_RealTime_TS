import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import LayerMenuIcon from "./LayerMenuIcon";
import useLayerMenuHandlers from "../../../Hooks/useLayerMenuHandlers";

const LayerMenu = () => {
  const { handleUpDown } = useLayerMenuHandlers();
  return (
    <div className="flex gap-1">
      <div onClick={() => handleUpDown("Up")}>
        <LayerMenuIcon Icon={FaArrowUp} size="20" color="Black" />
      </div>
      <div onClick={() => handleUpDown("Down")}>
        <LayerMenuIcon Icon={FaArrowDown} size="20" color="Black" />
      </div>
    </div>
  );
};

export default LayerMenu;
