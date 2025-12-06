import type { IconType } from "react-icons";

interface LayerMenuIconProps {
  Icon: IconType;
  size: string;
  color: string;
  name: string;
}

const LayerMenuIcon = ({ Icon, size, color, name }: LayerMenuIconProps) => {
  return (
    <div className="hover:bg-gray-200 active:bg-gray-400 flex flex-col items-center justify-center rounded-full px-3 py-1 cursor-pointer select-none w-17">
      <Icon size={size} color={color} />
      <span>{name}</span>
    </div>
  );
};

export default LayerMenuIcon;
