import type Konva from "konva";
import { createRef, type RefObject } from "react";
import { create } from "zustand";

interface canvasState {
  stageRef: RefObject<Konva.Stage | null>;
  transformerRef: RefObject<Konva.Transformer | null>;
}

export const useCanvasStore = create<canvasState>(() => ({
  stageRef: createRef<Konva.Stage>(),
  transformerRef: createRef<Konva.Transformer>(),
}));
