import { useHistoryStore } from "../features/history/historyStore";
import type { HistoryAction } from "../features/history/type";

export default function useUndoRedoHandlers() {
  const undoStack = useHistoryStore((state) => state.undoStack);
  const redoStack = useHistoryStore((state) => state.redoStack);
  const modifyStacks = useHistoryStore((state) => state.modifyStacks);
  const updateShapesUndoRedo = useHistoryStore(
    (state) => state.updateShapesUndoRedo,
  );

  //! Undo CLick
  function doUndo() {
    if (undoStack?.length === 0) return;

    const latestAction: HistoryAction = undoStack[undoStack.length - 1];

    if (!latestAction) return;

    console.log("Latest Action", latestAction);

    const updatedUndoStack = undoStack.slice(0, -1);

    //? update undo without the latest action
    modifyStacks(updatedUndoStack, "undo");

    //? update redo with the latest action
    const updatedRedoStack: HistoryAction[] = [
      ...redoStack,
      inverseType(latestAction),
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
      inverseType(latestRedo),
    ];

    //? update undo with the latestRedo
    modifyStacks(updatedUndoStack, "undo");

    //? update shape
    // console.log(latestRedo);

    updateShapesUndoRedo(latestRedo, "redo");
  }

  function inverseType(action: HistoryAction): HistoryAction {
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

      case "AddGroup":
        return {
          ...action,
          type: "RemoveGroup",
        };

      case "RemoveGroup":
        return {
          ...action,
          type: "AddGroup",
        };

      default:
        return action;
    }
  }

  return { doUndo, doRedo };
}
