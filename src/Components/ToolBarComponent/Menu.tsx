import type { MouseEventHandler } from "react";
import { icon } from "../../assets/index";

interface MenuProps {
  setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  openMenu: boolean;
}

const Menu = ({ setOpenMenu, openMenu }: MenuProps) => {
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    setOpenMenu((prev) => !prev);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex w-full justify-between shadow-sm items-center">
        <div className="flex gap-3 items-center px-3 py-1">
          <img className="w-5" src={icon} alt="" />
          <span className="font-medium text-gray-500 hover:underline cursor-pointer">
            File
          </span>
          <span className="font-medium text-gray-500 hover:underline cursor-pointer">
            Edit
          </span>
          <span className="font-medium text-gray-500 hover:underline cursor-pointer">
            View
          </span>
          <span className="font-medium text-gray-500 hover:underline cursor-pointer">
            Help
          </span>
          <span
            onClick={handleClick}
            className={`font-medium text-gray-500 cursor-pointer px-1 py-1 select-none rounded-sm ${
              openMenu ? "bg-black text-white" : ""
            }`}
          >
            Tools
          </span>
        </div>

        <div className="flex items-center">
          <button className="bg-red-500 px-3 py-1 text-white rounded-sm active:bg-red-300 cursor-pointer">
            Leave
          </button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
