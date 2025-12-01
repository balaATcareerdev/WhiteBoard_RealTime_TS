import { useEffect } from "react";
import type { UndoType } from "../Data/LayerData";

interface UndoRedoHandlerPropsType {
  undoStack: UndoType[];
  redoStack: UndoType[];
  modifyStacks: (newShape: UndoType[], stackType: string) => void;
  updateShapesUndoRedo: (
    latestAction: UndoType,
    actionType: "undo" | "redo"
  ) => void;
}

export default function useUndoRedoHandlers({
  undoStack,
  redoStack,
  modifyStacks,
  updateShapesUndoRedo,
}: UndoRedoHandlerPropsType) {
  function doUndo() {
    if (undoStack?.length === 0) return;
    console.log(undoStack);

    const latestAction: UndoType = undoStack[undoStack.length - 1];

    if (!latestAction) return;
    console.log(latestAction);

    const updatedUndoStack = undoStack.slice(0, -1);

    // update undo
    modifyStacks(updatedUndoStack, "undo");

    // update redo
    const updatedRedoStack: UndoType[] = [
      ...redoStack,
      InverseType(latestAction),
    ];
    modifyStacks(updatedRedoStack, "redo");

    updateShapesUndoRedo(latestAction, "undo");
  }

  function doRedo() {
    if (redoStack.length === 0) return;
    const updatedRedoStack = redoStack.slice(0, -1);

    // update redo
    modifyStacks(updatedRedoStack, "redo");

    const latestRedo = redoStack[redoStack.length - 1];
    const updatedUndoStack: UndoType[] = [
      ...undoStack,
      InverseType(latestRedo),
    ];

    console.log(latestRedo);

    // update undo
    modifyStacks(updatedUndoStack, "undo");

    // update shape
    updateShapesUndoRedo(latestRedo, "redo");
  }

  function InverseType(action: UndoType): UndoType {
    switch (action.type) {
      case "Add":
        return {
          ...action,
          type: "Remove",
        };

      case "Remove":
        return {
          ...action,
          type: "Add",
        };

      default:
        return action;
    }
  }

  useEffect(() => {
    console.log(undoStack);
  }, [undoStack]);

  return { doUndo, doRedo };
}
