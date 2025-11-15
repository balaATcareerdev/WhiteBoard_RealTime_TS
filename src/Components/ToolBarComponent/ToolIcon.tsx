import type { IconType } from "react-icons";

interface Tool {
  size: number;
  Icon: IconType;
  color?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const ToolIcon = ({ size, Icon, color, onClick }: Tool) => {
  return (
    <div
      className="p-2 hover:bg-gray-300 rounded-full transition-all ease-in-out duration-300"
      onClick={onClick}
    >
      <Icon size={size} color={`${color ? color : "#364153"}`} />
    </div>
  );
};

export default ToolIcon;
