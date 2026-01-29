export type ShapeType = "Rectangle" | "Circle" | "Scribble" | "Line";

export interface ShapeNode {
  id: string;
  name: string;
  type: "shape";
  shapeType: ShapeType;
  parentId: string;
  pos: number;
  visibility: boolean;
  lock: boolean;

  props: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    radius?: number;
    points?: number[];
    stroke: string | undefined;
    strokeWidth: number;
    fill?: string | undefined;
    rotation?: number;
  };
}

export interface GroupNode {
  id: string;
  name: string;
  type: "group";
  parentId: string;
  children: string[];
  pos: number;
  visibility: boolean;
  lock: boolean;

  props: {
    x: number;
    y: number;
    rotation?: number;
  };
}

export type LayerNode = ShapeNode | GroupNode;

export interface RootNode {
  children: string[];
}

export interface LayerTree {
  root: RootNode;
  nodes: Record<string, LayerNode>;
}
