import greenwei from "./greenwei";
import normal from "./normal";
import pikachu from "./pikachu";
import superhhh from "./superhhh";

export const modes = {
  pikachu,
  superhhh,
  greenwei,
  normal,
};

export type ModeName = keyof typeof modes;

export const modeList = Object.values(modes);
