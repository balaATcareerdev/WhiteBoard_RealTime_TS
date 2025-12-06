import type { IconType } from "react-icons";

interface IconProps {
  Sym: IconType;
  size: number;
  color: string;
}

const Icon = ({ Sym, size, color }: IconProps) => {
  return (
    <div>
      <Sym size={size} color={color} />
    </div>
  );
};

export default Icon;
