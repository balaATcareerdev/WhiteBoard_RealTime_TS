export type ShapeType = "Rectangle" | "Circle" | "Scribble" | "Line";

export interface ShapeNode {
  id: string;
  name: string;
  type: "shape";
  shapeType: ShapeType;
  parentId: string;
  pos: number;
  visibility: boolean;

  props: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    radius?: number;
    points?: number[];
    stroke: string;
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

export interface LayerData {
  root: RootNode;
  nodes: Record<string, LayerNode>;
}

// dummy data
export const dummyLayerData: LayerData = {
  root: {
    children: ["group-1", "shape-3"], //! orders in the panel
  },
  nodes: {
    "group-1": {
      id: "group-1",
      name: "Group-1",
      type: "group",
      parentId: "root",
      children: ["shape-1"],
      pos: 2,
      visibility: true,

      props: {
        x: 200,
        y: 100,
        rotation: 0,
      },
    },

    "shape-1": {
      id: "shape-1",
      name: "Rectangle-1",
      type: "shape",
      shapeType: "Rectangle",
      parentId: "group-1",
      pos: 1,
      visibility: true,

      props: {
        x: 100,
        y: 200,
        width: 100,
        height: 100,
        stroke: "Black",
        strokeWidth: 4,
      },
    },

    "shape-3": {
      id: "shape-3",
      name: "Circle1",
      type: "shape",
      shapeType: "Circle",
      parentId: "root",
      pos: 1,
      visibility: true,
      props: {
        x: 200,
        y: 200,
        radius: 10,
        stroke: "Green",
        strokeWidth: 5,
        fill: "Green",
      },
    },
  },
};

export type UndoRedoType = "Add" | "Remove" | "Update";

export interface AddType {
  type: "Add";
  startingPos: { x: number; y: number };
  shapeDetails: ShapeNode;
}

export interface RemoveType {
  type: "Remove";
  startingPos: { x: number; y: number };
  shapeDetails: ShapeNode;
}

export interface UpdateType {
  type: "Update";
  id: string;
  parentId: string;
  prev: Partial<ShapeNode["props"]>;
  next: Partial<ShapeNode["props"]>;
}

export type UndoType = AddType | UpdateType | RemoveType;

// dummy undo redo
export const dummyUndo: UndoType[] = [
  {
    type: "Add",
    startingPos: { x: 100, y: 200 },
    shapeDetails: {
      id: crypto.randomUUID(),
      name: "Rectangle-New",
      type: "shape",
      shapeType: "Rectangle",
      parentId: "root",
      pos: 4,
      visibility: true,
      props: {
        x: 100,
        y: 200,
        width: 0,
        height: 0,
        stroke: "Red",
        fill: undefined,
        strokeWidth: 4,
      },
    },
  },
  {
    type: "Update",
    id: "shape-1",
    parentId: "group-1",
    prev: {
      x: 100,
    },
    next: {
      x: 200,
    },
  },
];
