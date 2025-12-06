import { create } from "zustand";

export type ToolType =
  | "Rectangle"
  | "Circle"
  | "Scribble"
  | "Line"
  | "Move"
  | "Clear"
  | "ColorPic"
  | "Undo"
  | "Redo";

interface MenuStoreProps {
  tool: ToolType;
  color: string;
  showColorPalet: boolean;
  strokeWidth: number;
  setTool: (newTool: ToolType) => void;
  setColor: (newColor: string) => void;
  setShowColorPalet: (newState: boolean) => void;
  setStrokeWidth: (newWidth: number) => void;
}

export const useMenuStore = create<MenuStoreProps>((set) => ({
  tool: "Rectangle",
  color: "Black",
  showColorPalet: false,
  strokeWidth: 4,

  setTool: (newTool: ToolType) => {
    set({
      tool: newTool,
    });
  },
  setColor: (newColor) => {
    set({ color: newColor });
  },

  setShowColorPalet: (newState) => {
    set({ showColorPalet: newState });
  },

  setStrokeWidth: (newWidth) => {
    set({ strokeWidth: newWidth });
  },
}));
