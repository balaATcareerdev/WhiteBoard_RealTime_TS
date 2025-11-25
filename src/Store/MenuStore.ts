import { create } from "zustand";

export type ToolType =
  | "Rectangle"
  | "Circle"
  | "Scribble"
  | "Pen"
  | "Move"
  | "Clear"
  | "ColorPic"
  | "Undo"
  | "Redo";

interface MenuStoreProps {
  tool: ToolType;
  setTool: (newTool: ToolType) => void;
}

export const useMenuStore = create<MenuStoreProps>((set) => ({
  tool: "Rectangle",
  setTool: (newTool: ToolType) => {
    set({
      tool: newTool,
    });
  },
}));
