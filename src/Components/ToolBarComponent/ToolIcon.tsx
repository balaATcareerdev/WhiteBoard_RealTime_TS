import type { IconType } from "react-icons";

interface ToolIconProps {
  Icon: IconType;
  size: number;
  isActive: boolean;
  opFunc: () => void;
}

const ToolIcon = ({ Icon, size, isActive, opFunc }: ToolIconProps) => {
  return (
    <div
      onClick={opFunc}
      className={`p-2 ${
        isActive ? "" : "hover:bg-white"
      } rounded-md cursor-pointer ${
        isActive ? "bg-[#155dfc]" : ""
      } transition-colors duration-300`}
    >
      <Icon size={size} color={isActive ? "white" : ""} />
    </div>
  );
};

export default ToolIcon;
