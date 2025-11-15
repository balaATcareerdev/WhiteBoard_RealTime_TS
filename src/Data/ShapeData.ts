interface Shape {
  x: number;
  y: number;
  height: number;
  width: number;
  fill: string | null;
  strokeWidth: number;
  stroke: string;
  visible: boolean;
  locked: boolean;
  pos: number;
  rotation: number;
  name: string;
}

export const allShapes: Record<string, Shape> = {
  id1: {
    x: 200,
    y: 100,
    height: 100,
    width: 200,
    fill: null,
    strokeWidth: 4,
    stroke: "black",
    visible: true,
    locked: false,
    pos: 1,
    rotation: 0,
    name: "Rectangle1",
  },
  id2: {
    x: 150,
    y: 50,
    height: 100,
    width: 150,
    fill: "red",
    strokeWidth: 4,
    stroke: "green",
    visible: true,
    locked: false,
    pos: 2,
    rotation: 0,
    name: "Rectangle2",
  },
};
