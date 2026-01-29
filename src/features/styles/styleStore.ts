import { create } from "zustand";

interface styleState {
  color: string;
  strokeWidth: number;
  setColor: (newColor: string) => void;
  setStrokeWidth: (newWidth: number) => void;
  showColorPalet: boolean;
  toggleColorPalet: (newState: boolean) => void;
}

export const useStyleStore = create<styleState>((set) => ({
  color: "#000000",
  strokeWidth: 4,
  setColor: (newColor) => set({ color: newColor }),
  setStrokeWidth: (newWidth) => set({ strokeWidth: newWidth }),
  showColorPalet: false,
  toggleColorPalet: (newState) => set({ showColorPalet: newState }),
}));
