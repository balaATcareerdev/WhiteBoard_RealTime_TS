import type { HistoryAction } from "./type";

export const dummyHistory: HistoryAction[] = [
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
      lock: false,
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
