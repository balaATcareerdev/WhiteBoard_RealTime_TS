import type { ShapeNode } from "../layers/type";

export interface AddAction {
  type: "Add";
  startingPos: { x: number; y: number };
  shapeDetails: ShapeNode;
}

export interface RemoveAction {
  type: "Remove";
  startingPos: { x: number; y: number };
  shapeDetails: ShapeNode;
}

export interface UpdateAction {
  type: "Update";
  id: string;
  parentId: string;
  prev: Partial<ShapeNode["props"]>;
  next: Partial<ShapeNode["props"]>;
}

export type HistoryAction = AddAction | RemoveAction | UpdateAction;
