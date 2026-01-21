import { useState } from "react";
import type { IconType } from "react-icons";

interface PropertiesButtonProps {
  Icon: IconType;
  text: string;
  color: string;
  funct: () => void;
  disabled?: boolean;
}

const PropertiesButton = ({
  Icon,
  text,
  color,
  funct,
  disabled,
}: PropertiesButtonProps) => {
  //! hover is for saving the hover status
  const [hover, setHover] = useState(false);

  return (
    <button
      style={{
        backgroundColor: hover ? `${color}10` : "transparent",
      }}
      className={`flex items-center justify-center p-2 border rounded-md border-gray-200  ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={funct}
    >
      <Icon size={20} color={color} />
      <span className="ml-2 text-sm text-gray-700">{text}</span>
    </button>
  );
};

export default PropertiesButton;
