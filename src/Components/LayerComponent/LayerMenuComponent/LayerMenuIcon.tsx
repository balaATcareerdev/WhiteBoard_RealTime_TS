import type { IconType } from "react-icons";

interface LayerMenuIconProps {
  Icon: IconType;
  size: string;
  color: string;
}

const LayerMenuIcon = ({ Icon, size, color }: LayerMenuIconProps) => {
  return (
    <div className="w-7 hover:bg-gray-200 active:bg-gray-400 flex items-center justify-center h-7 rounded-full">
      <Icon size={size} color={color} />
    </div>
  );
};

export default LayerMenuIcon;
