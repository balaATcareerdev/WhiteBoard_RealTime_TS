import type { IconType } from "react-icons";

interface Tool {
  size: number;
  Icon: IconType;
  color?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  selected: boolean;
}

const ToolIcon = ({ size, Icon, color, onClick, selected }: Tool) => {
  return (
    <div
      className={`p-2 hover:bg-gray-300 rounded-full transition-all ease-in-out duration-300 ${
        selected ? "bg-gray-300" : ""
      }`}
      onClick={onClick}
    >
      <Icon size={size} color={`${color ? color : "#364153"}`} />
    </div>
  );
};

export default ToolIcon;
