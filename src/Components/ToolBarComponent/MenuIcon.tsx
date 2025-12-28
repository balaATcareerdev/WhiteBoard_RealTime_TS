import { useState } from "react";
import type { IconType } from "react-icons";

interface MenuIconProps {
  Icon: IconType;
  size: number;
  color: string;
  isHover: boolean;
  opFunc?: () => void;
}

const MenuIcon = ({ Icon, size, color, isHover, opFunc }: MenuIconProps) => {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        background: isHover && hover ? `${color}10` : "transparent",
      }}
      className="p-3 rounded-md transition-colors duration-200 cursor-pointer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={opFunc}
    >
      <Icon size={size} color={color} />
    </div>
  );
};

export default MenuIcon;
