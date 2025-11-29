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
import { useState } from "react";
import { useMenuStore } from "../../Store/MenuStore";

const Tools = () => {
  const [showColorPalet, setShowColorPalet] = useState(false);
  const [selectedColor, setSelectedColor] = useState("black");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const setTool = useMenuStore((state) => state.setTool);
  const tool = useMenuStore((state) => state.tool);

  return (
    <div className="flex items-center gap-1 absolute z-100 top-20">
      <div className="bg-white rounded-md mx-auto flex gap-1 p-2 shadow-md cursor-pointer">
        <div className="flex p-1 border-r-2">
          <ToolIcon size={35} Icon={BiUndo} selected={tool === "Undo"} />
          <ToolIcon size={35} Icon={BiRedo} selected={tool === "Redo"} />
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
          <ToolIcon size={20} Icon={GrCursor} selected={tool === "Move"} />
          <ToolIcon
            size={20}
            Icon={AiOutlineClear}
            selected={tool === "Clear"}
          />
          <div className="relative">
            <ToolIcon
              size={30}
              Icon={BiSolidColor}
              color={selectedColor}
              onClick={() => setShowColorPalet((prev) => !prev)}
              selected={tool === "ColorPic"}
            />
            {showColorPalet && (
              <div className="absolute z-50">
                <HexColorPicker onChange={setSelectedColor} />
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
