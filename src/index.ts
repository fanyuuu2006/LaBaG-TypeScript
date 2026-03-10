import { LaBaG } from "./labag";
import { modes } from "./modes";
import { LaBaGEvent, Pattern, PatternName } from "./types";
import { Mode } from "./mode";
import { patterns } from "./pattern";
import { Recorder, GameRecord } from "./recorder";
import { RecordChecker } from "./recordChecker";
import { ModeName } from './types/index';

const labag = new LaBaG();
modes.forEach((mode) => {
  labag.addMode(mode);
});
const recorder = new Recorder(labag);
const checker = new RecordChecker(labag);
export {
  labag,
  recorder,
  checker,
  modes,
  patterns,
  LaBaG,
  Recorder,
  RecordChecker,
  Mode,
  type LaBaGEvent,
  type Pattern,
  type PatternName,
  type GameRecord,
  type ModeName,
};

