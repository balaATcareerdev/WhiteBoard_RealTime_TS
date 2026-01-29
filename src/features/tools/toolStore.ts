import { create } from "zustand";
import type { Tool } from "./tools";

interface ToolState {
  currentTool: Tool;
  setCurrentTool: (tool: Tool) => void;
}

export const useToolStore = create<ToolState>((set) => ({
  currentTool: "Rectangle",
  setCurrentTool: (tool: Tool) => set({ currentTool: tool }),
}));
