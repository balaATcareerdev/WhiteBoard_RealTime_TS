import type { HistoryAction } from "../features/history/type";
import { useBoardStore } from "../Store/BoardStore";

export default function useUndoRedoHandlers() {
  const undoStack = useBoardStore((state) => state.undoStack);
  const redoStack = useBoardStore((state) => state.redoStack);
  const modifyStacks = useBoardStore((state) => state.modifyStacks);
  const updateShapesUndoRedo = useBoardStore(
    (state) => state.updateShapesUndoRedo,
  );

  //! Undo CLick
  function doUndo() {
    if (undoStack?.length === 0) return;

    const latestAction: HistoryAction = undoStack[undoStack.length - 1];

    if (!latestAction) return;

    const updatedUndoStack = undoStack.slice(0, -1);

    //? update undo without the latest action
    modifyStacks(updatedUndoStack, "undo");

    //? update redo with the latest action
    const updatedRedoStack: HistoryAction[] = [
      ...redoStack,
      InverseType(latestAction),
    ];
    modifyStacks(updatedRedoStack, "redo");

    updateShapesUndoRedo(latestAction, "undo");
  }

  // ! Redo CLick
  function doRedo() {
    if (redoStack.length === 0) return;
    const updatedRedoStack = redoStack.slice(0, -1);

    //? update redo without the latest redo
    modifyStacks(updatedRedoStack, "redo");

    const latestRedo = redoStack[redoStack.length - 1];
    const updatedUndoStack: HistoryAction[] = [
      ...undoStack,
      InverseType(latestRedo),
    ];

    //? update undo with the latestRedo
    modifyStacks(updatedUndoStack, "undo");

    //? update shape
    updateShapesUndoRedo(latestRedo, "redo");
  }

  function InverseType(action: HistoryAction): HistoryAction {
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

      case "Update":
        return {
          ...action,
          type: "Update",
          prev: action.next,
          next: action.prev,
        };

      default:
        return action;
    }
  }

  return { doUndo, doRedo };
}
