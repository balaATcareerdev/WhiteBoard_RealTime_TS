interface SaveColorButtonProps {
  setFunc: (visible: boolean) => void;
  inputValueUpdate: (
    id: string,
    key: string,
    value: string | number | number[] | undefined
  ) => void;
  id: string;
  name: string;
  value: string;
}

const SaveColorButton = ({
  setFunc,
  inputValueUpdate,
  id,
  name,
  value,
}: SaveColorButtonProps) => {
  return (
    <button
      onClick={() => {
        setFunc(false);
        inputValueUpdate(id, name, value);
      }}
      className="py-1 px-2 cursor-pointer text-lg text-green-500 rounded-md border border-green-500 hover:text-white hover:bg-green-500  transition-all duration-150 active:scale-95"
    >
      Save
    </button>
  );
};

export default SaveColorButton;
