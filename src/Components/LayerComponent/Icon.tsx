import { useState } from "react";
import type { IconType } from "react-icons";

interface IconProps {
  Sym: IconType;
  size: number;
  color?: string;
  opFunc?: (e: React.MouseEvent<HTMLDivElement>) => void;
  isHover: boolean;
}

const Icon = ({ Sym, size, color, opFunc, isHover }: IconProps) => {
  const [hover, setHover] = useState<boolean>(false);
  return (
    <div
      style={{
        background: isHover && hover ? `${color}10` : "transparent",
      }}
      onClick={opFunc}
      className="cursor-pointer p-1 rounded-md"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Sym size={size} color={color} />
    </div>
  );
};

export default Icon;
