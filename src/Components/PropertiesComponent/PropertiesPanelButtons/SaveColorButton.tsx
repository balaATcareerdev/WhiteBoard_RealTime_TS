import type { ShapeNode, UpdateType } from "../../../Data/LayerData";

interface SaveColorButtonProps {
  setFunc: (visible: boolean) => void;
  inputValueUpdate: (
    id: string,
    key: string,
    value: string | number | number[] | undefined,
  ) => void;
  value: string;
  setCurrentUpdateAction: (action: UpdateType) => void;
  node: ShapeNode;
  propertyType: "Fill" | "Stroke";
}

const SaveColorButton = ({
  setFunc,
  inputValueUpdate,
  value,
  node,
  setCurrentUpdateAction,
  propertyType,
}: SaveColorButtonProps) => {
  const currentState: UpdateType = {
    type: "Update",
    id: node.id,
    parentId: node.parentId,
    prev:
      propertyType === "Fill"
        ? {
            fill: node.props.fill,
          }
        : {
            stroke: node.props.stroke,
          },
    next:
      propertyType === "Fill"
        ? {
            fill: value,
          }
        : {
            stroke: value,
          },
  };

  return (
    <button
      onClick={() => {
        setFunc(false);
        inputValueUpdate(
          node.id,
          propertyType === "Fill" ? "fill" : "stroke",
          value,
        );
        setCurrentUpdateAction(currentState);
      }}
      className="py-1 px-2 cursor-pointer text-lg text-green-500 rounded-md border border-green-500 hover:text-white hover:bg-green-500  transition-all duration-150 active:scale-95"
    >
      Save
    </button>
  );
};

export default SaveColorButton;
