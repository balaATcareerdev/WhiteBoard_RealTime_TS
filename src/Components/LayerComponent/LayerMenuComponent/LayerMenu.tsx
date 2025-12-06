import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { CiUnlock } from "react-icons/ci";
import { FaObjectGroup } from "react-icons/fa";
import { FaObjectUngroup } from "react-icons/fa";
import LayerMenuIcon from "./LayerMenuIcon";
import useLayerMenuHandlers from "../../../Hooks/useLayerMenuHandlers";
import { useLayerStore } from "../../../Store/LayerStore";

const LayerMenu = () => {
  const { handleUpDown } = useLayerMenuHandlers();
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const lockedLayer = useLayerStore((state) => state.lockedLayer);
  const setLockedLayers = useLayerStore((state) => state.setLockedLayers);
  return (
    <div>
      <div className="flex gap-1 justify-around pt-2">
        <div onClick={() => handleUpDown("Up")}>
          <LayerMenuIcon
            Icon={FaArrowUp}
            size="20"
            color="Black"
            name="Front"
          />
        </div>
        <div onClick={() => handleUpDown("Down")}>
          <LayerMenuIcon
            Icon={FaArrowDown}
            size="20"
            color="Black"
            name="Back"
          />
        </div>

        <div>
          <LayerMenuIcon
            Icon={MdDeleteOutline}
            size="20"
            color="Black"
            name="Delete"
          />
        </div>
        {lockedLayer.includes(activeLayer) ? (
          <div onClick={() => setLockedLayers(activeLayer)}>
            <LayerMenuIcon
              Icon={CiUnlock}
              size="20"
              color="Black"
              name="UnLock"
            />
          </div>
        ) : (
          <div onClick={() => setLockedLayers(activeLayer)}>
            <LayerMenuIcon Icon={CiLock} size="20" color="Black" name="Lock" />
          </div>
        )}

        <div>
          <LayerMenuIcon
            Icon={FaObjectGroup}
            size="20"
            color="Black"
            name="Group"
          />
        </div>

        {/* <div>
        <LayerMenuIcon
          Icon={FaObjectUngroup}
          size="20"
          color="Black"
          name="Ungroup"
        />
      </div> */}
      </div>
    </div>
  );
};

export default LayerMenu;
