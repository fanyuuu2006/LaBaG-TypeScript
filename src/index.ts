import { LaBaG } from "./labag";
import { modeList, ModeName } from "./modes";
import { LaBaGEvent, Pattern, PatternName } from "./types";
import { Mode } from "./mode";
import { patterns } from "./pattern";
import { Recorder, GameRecord } from './recorder';
import { RecordChecker } from "./recordChecker";

const labag = new LaBaG();
modeList.forEach((mode) => {
  labag.addMode(mode);
});
const recorder = new Recorder(labag);
const checker = new RecordChecker(labag);
export {
  labag,
  recorder,
  checker,
  modeList,
  patterns,
  LaBaG,
  Recorder,
  RecordChecker,
  Mode,
  type LaBaGEvent,
  type Pattern,
  type PatternName,
  type ModeName,
  type GameRecord
};
