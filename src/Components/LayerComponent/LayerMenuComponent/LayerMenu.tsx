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
import { useBoardStore } from "../../../Store/BoardStore";
import { useEffect } from "react";

const LayerMenu = () => {
  const { handleUpDown } = useLayerMenuHandlers();
  const activeLayer = useLayerStore((state) => state.activeLayer);
  const setActiveLayer = useLayerStore((state) => state.setActiveLayer);
  const lockedLayer = useLayerStore((state) => state.lockedLayer);
  const setLockedLayers = useLayerStore((state) => state.setLockedLayers);
  const deleteShapeGroup = useBoardStore((state) => state.deleteShapeGroup);
  const allShapes = useBoardStore((state) => state.allShapes);
  const groupUngroup = useBoardStore((state) => state.groupUngroup);

  function handleDelete() {
    const modal = document.getElementById("my_modal_5");
    if (modal) {
      (modal as HTMLDialogElement).close();
    }
  }

  useEffect(() => {
    console.log(allShapes);
  }, [allShapes]);

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

        <div
          onClick={() => {
            const modal = document.getElementById("my_modal_5");
            if (modal) {
              (modal as HTMLDialogElement).showModal();
            }
          }}
        >
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

        {allShapes.nodes[activeLayer] &&
          allShapes.nodes[activeLayer].type === "group" && (
            <div
              onClick={() => {
                groupUngroup("Ungroup", activeLayer);
                setActiveLayer("root");
              }}
            >
              <LayerMenuIcon
                Icon={FaObjectUngroup}
                size="20"
                color="Black"
                name="Ungroup"
              />
            </div>
          )}
      </div>

      <div>
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box">
            <h3 className="font-bold text-lg select-none">
              Are you sure want to delete the shape/group
            </h3>
            <p className="py-4 select-none">Press cancel to stop operation</p>
            <div className="modal-action">
              <div className="flex gap-1">
                {/* if there is a button in form, it will close the modal */}
                <button
                  onClick={() => {
                    deleteShapeGroup(activeLayer);
                    handleDelete();
                  }}
                  className="btn"
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    handleDelete();
                  }}
                  className="btn"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default LayerMenu;
