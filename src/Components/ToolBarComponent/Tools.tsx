import { LuRectangleHorizontal } from "react-icons/lu";
import { IoEllipseOutline } from "react-icons/io5";
import { GiPencilRuler } from "react-icons/gi";
import { FaPencil } from "react-icons/fa6";
import { FaHandSpock } from "react-icons/fa";
import { MdCleaningServices } from "react-icons/md";
import { IoIosColorFill } from "react-icons/io";

import ToolIcon from "./ToolIcon";

import { HexColorPicker } from "react-colorful";
import { useToolStore } from "../../features/tools/toolStore";
import { Tools as ToolList } from "../../features/tools/tools";
import { useStyleStore } from "../../features/styles/styleStore";
import { useLayerStore } from "../../features/layers/layerStore";

const Tools = () => {
  const currentTool = useToolStore((state) => state.currentTool);
  const setCurrentTool = useToolStore((state) => state.setCurrentTool);
  const clearShapes = useLayerStore((state) => state.clearShapes);
  const setColor = useStyleStore((state) => state.setColor);
  const showColorPalet = useStyleStore((state) => state.showColorPalet);
  const toggleColorPalet = useStyleStore((state) => state.toggleColorPalet);
  const color = useStyleStore((state) => state.color);
  return (
    <div className="flex flex-col p-2 gap-1 border-r border-b border-gray-200">
      <ToolIcon
        Icon={LuRectangleHorizontal}
        size={40}
        isActive={currentTool === ToolList.Rectangle}
        opFunc={() => {
          setCurrentTool(ToolList.Rectangle);
        }}
      />
      <ToolIcon
        Icon={IoEllipseOutline}
        size={40}
        isActive={currentTool === ToolList.Circle}
        opFunc={() => {
          setCurrentTool(ToolList.Circle);
        }}
      />
      <ToolIcon
        Icon={GiPencilRuler}
        size={40}
        isActive={currentTool === ToolList.Line}
        opFunc={() => {
          setCurrentTool(ToolList.Line);
        }}
      />
      <ToolIcon
        Icon={FaPencil}
        size={40}
        isActive={currentTool === ToolList.Scribble}
        opFunc={() => {
          setCurrentTool(ToolList.Scribble);
        }}
      />
      <ToolIcon
        Icon={FaHandSpock}
        size={40}
        isActive={currentTool === ToolList.Move}
        opFunc={() => {
          setCurrentTool(ToolList.Move);
        }}
      />
      <ToolIcon
        Icon={MdCleaningServices}
        size={40}
        isActive={currentTool === ToolList.Clear}
        opFunc={() => {
          clearShapes();
        }}
      />
      <div className="relative">
        <div
          onClick={() => toggleColorPalet(!showColorPalet)}
          className={`p-2  rounded-md cursor-pointer transition-colors duration-300 ${color === "#ffffff" ? "bg-gray-300" : "bg-white"}`}
        >
          <IoIosColorFill size={40} color={color} />
        </div>

        {showColorPalet && (
          <div className="absolute z-50">
            <HexColorPicker onChange={setColor} color={color} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools;
