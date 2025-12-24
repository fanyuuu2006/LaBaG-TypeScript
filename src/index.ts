import { LaBaG } from "./labag";
import { modeList, ModeName } from "./modes";
import { LaBaGEvent, Pattern, PatternName } from "./types";

const labag = new LaBaG();
modeList.forEach((mode) => {
    labag.addMode(mode);
});
export {
  labag,
  type LaBaGEvent,
  type Pattern,
  type PatternName,
  type ModeName,
};
