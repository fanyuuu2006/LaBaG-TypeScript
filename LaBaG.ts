import { P } from "./P";
import { Modes, ModeNames } from "./Mode";

export interface LaBaG {
  AllData: Record<string, Record<string, number>>;
  OneData: Record<string, number>;
  DataIndex: number;

  Times: number;
  Played: number;

  Score: number;
  MarginScore: number;

  Gss: P;
  Hhh: P;
  Hentai: P;
  Handson: P;
  Kachu: P;
  Rrr: P;
  Ps: [P, P, P];

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

export class BaseLaBaG implements LaBaG {
  AllData: Record<string, Record<string, number>> = {};
  OneData: Record<string, number> = {};
  DataIndex: number = 0;

  Times: number = 30;
  Played: number = 0;

  Score: number = 0;
  MarginScore: number = 0;

  Gss: P;
  Hhh: P;
  Hentai: P;
  Handson: P;
  Kachu: P;
  Rrr: P;
  Ps: [P, P, P];

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
