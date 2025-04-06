import { P } from "../types/P";
import { ModeNames } from "../types/Mode";

export interface LaBaG {
  AllData: Record<string, Record<string, number>>;
  OneData: Record<string, number>;
  DataIndex: number;

  Times: number;
  Played: number;

  Score: number;
  MarginScore: number;

  Ps: [P | null, P | null, P | null];

  RateRanges: Record<ModeNames, number[]>;
  ScoreTimes: Record<ModeNames, number>;
  ScoreTime: number;

  ModeToScreen: boolean;

  GameRunning(): boolean;
  NowMode(): ModeNames;
  Reset(): void;
  Random(): void;
  CalculateScore(): void;
  Result(): void;
  JudgeMode(): void;
  Logic(): void;
}
