import { LaBaG } from "./labag";
import { modeList, ModeName } from "./modes";
import { LaBaGEvent, Pattern, PatternName } from "./types";
import { Mode } from "./mode";
import { patterns } from "./pattern";

const labag = new LaBaG();
modeList.forEach((mode) => {
  labag.addMode(mode);
});
export {
  labag,
  modeList,
  patterns,
  LaBaG,
  Mode,
  type LaBaGEvent,
  type Pattern,
  type PatternName,
  type ModeName,
};
