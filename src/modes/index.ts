import greenwei from "./greenwei";
import normal from "./normal";
import pikachu from "./pikachu";
import superhhh from "./superhhh";

export const modes = {
  greenwei,
  normal,
  pikachu,
  superhhh,
} as const;

export type ModeName = typeof modes[keyof typeof modes]["name"];

export const modeList = Object.values(modes);
