import { LaBaG } from "./labag";
import { modeList, ModeName } from "./modes";
import { LaBaGEvent, Pattern, PatternName } from "./types";

const labag = new LaBaG();
modeList.forEach((mode) => {
  console.log(mode);
  if (mode.active) {
    labag.modes.push(mode);
  } else {
    labag.addMode(mode);
  }
});
export {
  labag,
  type LaBaGEvent,
  type Pattern,
  type PatternName,
  type ModeName,
};
