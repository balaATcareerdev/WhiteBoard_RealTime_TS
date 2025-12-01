import {
  BiUndo,
  BiRedo,
  BiCircle,
  BiRectangle,
  BiSolidColor,
} from "react-icons/bi";
import { PiScribbleLoop } from "react-icons/pi";
import { FaPenNib } from "react-icons/fa";
import { GrCursor } from "react-icons/gr";
import ToolIcon from "./ToolIcon";
import { AiOutlineClear } from "react-icons/ai";
import { HexColorPicker } from "react-colorful";
import { useMenuStore } from "../../Store/MenuStore";
import { useBoardStore } from "../../Store/BoardStore";
import useUndoRedoHandlers from "../../Hooks/useUndoRedoHandlers";

const Tools = () => {
  const setTool = useMenuStore((state) => state.setTool);
  const tool = useMenuStore((state) => state.tool);
  const clearShapes = useBoardStore((state) => state.clearShapes);
  const setColor = useMenuStore((state) => state.setColor);
  const color = useMenuStore((state) => state.color);
  const showColorPalet = useMenuStore((state) => state.showColorPalet);
  const setShowColorPalet = useMenuStore((state) => state.setShowColorPalet);
  const strokeWidth = useMenuStore((state) => state.strokeWidth);
  const setStrokeWidth = useMenuStore((state) => state.setStrokeWidth);

  const undoStack = useBoardStore((state) => state.undoStack);
  const redoStack = useBoardStore((state) => state.redoStack);
  const modifyStacks = useBoardStore((state) => state.modifyStacks);
  const updateShapesUndoRedo = useBoardStore(
    (state) => state.updateShapesUndoRedo
  );

  const { doUndo, doRedo } = useUndoRedoHandlers({
    undoStack,
    redoStack,
    modifyStacks,
    updateShapesUndoRedo,
  });

  return (
    <div className="flex items-center gap-1 absolute z-100 top-20">
      <div className="bg-white rounded-md mx-auto flex gap-1 p-2 shadow-md cursor-pointer">
        <div className="flex p-1 border-r-2">
          <ToolIcon
            onClick={() => doUndo()}
            size={35}
            Icon={BiUndo}
            selected={tool === "Undo"}
          />
          <ToolIcon
            onClick={() => doRedo()}
            size={35}
            Icon={BiRedo}
            selected={tool === "Redo"}
          />
        </div>

        <div className="flex items-center gap-2 p-1">
          <ToolIcon
            onClick={() => setTool("Rectangle")}
            size={25}
            Icon={BiRectangle}
            selected={tool === "Rectangle"}
          />
          <ToolIcon
            onClick={() => setTool("Circle")}
            size={25}
            Icon={BiCircle}
            selected={tool === "Circle"}
          />
          <ToolIcon
            onClick={() => setTool("Pen")}
            size={20}
            Icon={FaPenNib}
            selected={tool === "Pen"}
          />
          <ToolIcon
            onClick={() => setTool("Scribble")}
            size={25}
            Icon={PiScribbleLoop}
            selected={tool === "Scribble"}
          />
          <ToolIcon
            onClick={() => setTool("Move")}
            size={20}
            Icon={GrCursor}
            selected={tool === "Move"}
          />
          <ToolIcon
            size={20}
            Icon={AiOutlineClear}
            selected={tool === "Clear"}
            onClick={() => clearShapes()}
          />
          <div className="relative">
            <ToolIcon
              size={30}
              Icon={BiSolidColor}
              color={color}
              onClick={() => setShowColorPalet(!showColorPalet)}
              selected={tool === "ColorPic"}
            />
            {showColorPalet && (
              <div className="absolute z-50">
                <HexColorPicker onChange={setColor} />
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center items-center gap-1">
            <span className="text-blue-500 bg-blue-100 px-2 rounded-full">
              {strokeWidth}
            </span>
            <input
              type="range"
              min={4}
              max={20}
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-40 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer
                   accent-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
