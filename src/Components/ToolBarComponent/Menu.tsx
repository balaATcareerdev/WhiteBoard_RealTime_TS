import { useState } from "react";
import { MdOutlineUndo } from "react-icons/md";
import { MdOutlineRedo } from "react-icons/md";
import MenuIcon from "./MenuIcon";
import { IoCloudDownload } from "react-icons/io5";
import { FaSave } from "react-icons/fa";
import useUndoRedoHandlers from "../../Hooks/useUndoRedoHandlers";

const Menu = () => {
  const [whiteboardName, setWhiteboardName] = useState<string>("Whiteboard");
  const { doUndo, doRedo } = useUndoRedoHandlers();

  return (
    <div className="h-20 flex items-center justify-between px-3 border-b border-gray-200 select-none">
      {/* Left */}
      <div className="flex items-center bg-white w-96 justify-between">
        {/* Icon */}
        <div>
          <span className="p-3 text-white bg-[#155dfc] rounded-md mr-2">
            {whiteboardName.charAt(0)}
          </span>
          <span className="font-medium text-xl">{whiteboardName}</span>
        </div>

        {/* Menu Option */}
        <div className="flex gap-2 flex-1 justify-between ml-5">
          <p className="font-medium justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer">
            File
          </p>
          <p className="font-medium justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer">
            Edit
          </p>
          <p className="font-medium justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer">
            View
          </p>
          <p className="font-medium justify-between px-2 py-1 hover:bg-gray-100 cursor-pointer">
            Help
          </p>
        </div>
      </div>

      {/* Middle */}
      <div className="flex w-24 justify-between">
        {/* Undo Redo */}
        <MenuIcon
          Icon={MdOutlineUndo}
          size={25}
          color="#000000"
          isHover={true}
          opFunc={doUndo}
        />
        <MenuIcon
          Icon={MdOutlineRedo}
          size={25}
          color="#000000"
          isHover={true}
          opFunc={doRedo}
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        {/* Share */}
        <MenuIcon
          Icon={IoCloudDownload}
          size={30}
          color="#155dfc"
          isHover={true}
        />
        <div className="flex items-center">
          <button className="flex items-center bg-[#155dfc] pr-7 pl-4 rounded-md text-white active:bg-[#3371f7] cursor-pointer">
            <MenuIcon
              Icon={FaSave}
              size={20}
              color="#fffffff"
              isHover={false}
            />
            <span className="font-medium text-lg">Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
