import type { LayerTree } from "./type";

export const dummyLayerTree: LayerTree = {
  root: {
    children: ["group-1", "circ-1", "circ-2", "circ-3"],
  },
  nodes: {
    "group-1": {
      id: "group-1",
      name: "Group-1",
      type: "group",
      parentId: "root",
      children: ["rec-1", "rec-2"],
      pos: 3,
      visibility: true,
      lock: false,

      props: {
        x: 200,
        y: 100,
        rotation: 0,
      },
    },

    "rec-1": {
      id: "rec-1",
      name: "Rectangle-1",
      type: "shape",
      shapeType: "Rectangle",
      parentId: "group-1",
      pos: 2,
      visibility: true,
      lock: true,

      props: {
        x: 100,
        y: 200,
        width: 100,
        height: 100,
        fill: "",
        stroke: "#278c5c",
        strokeWidth: 4,
      },
    },

    "rec-2": {
      id: "rec-2",
      name: "Rectangle-2",
      type: "shape",
      shapeType: "Rectangle",
      parentId: "group-1",
      pos: 1,
      visibility: true,
      lock: true,

      props: {
        x: 100,
        y: 200,
        width: 100,
        height: 100,
        stroke: "#2733a7",
        strokeWidth: 4,
        fill: undefined,
      },
    },

    "circ-1": {
      id: "circ-1",
      name: "Circle1",
      type: "shape",
      shapeType: "Circle",
      parentId: "root",
      pos: 2,
      visibility: true,
      lock: false,

      props: {
        x: 200,
        y: 200,
        radius: 10,
        stroke: "#008000",
        strokeWidth: 5,
        fill: "#2733a7",
      },
    },

    "circ-2": {
      id: "circ-2",
      name: "Circle2",
      type: "shape",
      shapeType: "Circle",
      parentId: "root",
      pos: 1,
      visibility: true,
      lock: false,

      props: {
        x: 200,
        y: 200,
        radius: 10,
        stroke: undefined,
        strokeWidth: 5,
        fill: "#a6e22e",
      },
    },

    "circ-3": {
      id: "circ-3",
      name: "Circle3",
      type: "shape",
      shapeType: "Circle",
      parentId: "root",
      pos: 4,
      visibility: true,
      lock: false,

      props: {
        x: 200,
        y: 200,
        radius: 10,
        stroke: "#3284c9",
        strokeWidth: 5,
        fill: "#2733a7",
      },
    },
  },
};
