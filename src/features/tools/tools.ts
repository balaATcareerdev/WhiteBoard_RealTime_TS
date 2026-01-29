export const Tools = {
  Rectangle: "Rectangle",
  Circle: "Circle",
  Scribble: "Scribble",
  Line: "Line",

  Move: "Move",
  ColorPic: "ColorPic",

  Undo: "Undo",
  Redo: "Redo",
  Clear: "Clear",
} as const;

export type DrawTools =
  | typeof Tools.Rectangle
  | typeof Tools.Circle
  | typeof Tools.Scribble
  | typeof Tools.Line;

export type ModeTools = typeof Tools.Move | typeof Tools.ColorPic;

export type ActionTools =
  | typeof Tools.Undo
  | typeof Tools.Redo
  | typeof Tools.Clear;

export type Tool = DrawTools | ModeTools | ActionTools;
