import { LuRectangleHorizontal } from "react-icons/lu";
import { IoEllipseOutline } from "react-icons/io5";
import { GiPencilRuler } from "react-icons/gi";
import { FaPencil } from "react-icons/fa6";
import { FaHandSpock } from "react-icons/fa";
import { MdCleaningServices } from "react-icons/md";

import ToolIcon from "./ToolIcon";
import { useMenuStore } from "../../Store/MenuStore";

import { Tools as ToolList } from "../../constants/ToolConst";
import { useBoardStore } from "../../Store/BoardStore";

const Tools = () => {
  const tool = useMenuStore((state) => state.tool);
  const setTool = useMenuStore((state) => state.setTool);
  const clearShapes = useBoardStore((state) => state.clearShapes);

  return (
    <div className="flex flex-col p-2 gap-1 border-r border-b border-gray-200">
      <ToolIcon
        Icon={LuRectangleHorizontal}
        size={40}
        isActive={tool === ToolList.Rectangle}
        opFunc={() => {
          setTool("Rectangle");
        }}
      />
      <ToolIcon
        Icon={IoEllipseOutline}
        size={40}
        isActive={tool === ToolList.Circle}
        opFunc={() => {
          setTool("Circle");
        }}
      />
      <ToolIcon
        Icon={GiPencilRuler}
        size={40}
        isActive={tool === ToolList.Line}
        opFunc={() => {
          setTool("Line");
        }}
      />
      <ToolIcon
        Icon={FaPencil}
        size={40}
        isActive={tool === ToolList.Scribble}
        opFunc={() => {
          setTool("Scribble");
        }}
      />
      <ToolIcon
        Icon={FaHandSpock}
        size={40}
        isActive={tool === ToolList.Move}
        opFunc={() => {
          setTool("Move");
        }}
      />
      <ToolIcon
        Icon={MdCleaningServices}
        size={40}
        isActive={tool === ToolList.Clear}
        opFunc={() => {
          clearShapes();
        }}
      />
    </div>
  );
};

export default Tools;
