interface RemoveColorButtonProps {
  setFunc: (visible: boolean) => void;
  inputValueUpdate: (
    id: string,
    key: string,
    value: string | number | number[] | undefined
  ) => void;
  name: string;
  id: string;
}

const RemoveColorButton = ({
  setFunc,
  inputValueUpdate,
  id,
  name,
}: RemoveColorButtonProps) => {
  return (
    <button
      onClick={() => {
        setFunc(false);
        inputValueUpdate(id, name, "");
      }}
      className="text-lg px-2 py-1 bg-red-100 text-red-500 rounded-sm active:scale-95 hover:bg-red-200 transition-all duration-150 cursor-pointer"
    >
      Remove
    </button>
  );
};

export default RemoveColorButton;
