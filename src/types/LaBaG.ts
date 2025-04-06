import { P } from "../types/P";
import { ModeNames } from "../types/Mode";

export type OneDataType = Partial<
  Record<"SuperHHH" | "GreenWei" | `RandNums[${0 | 1 | 2}]`, number>
>;

export type AllDataType = Record<`${number}`, OneDataType>;

export interface LaBaG {
  AllData: AllDataType;
  OneData: OneDataType;
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
