import { Modes } from "..";
import { AllDataType, LaBaG, OneDataType } from "./LaBaG";
import { Mode, ModeNames } from "./Mode";
import { P } from "./P";
import { RandInt } from "../utils/RandInt";

export class BaseLaBaG implements LaBaG {
  AllData: AllDataType = {};
  OneData: OneDataType = {};
  DataIndex: number = 0;

  Times: number = 30;
  Played: number = 0;

  Score: number = 0;
  MarginScore: number = 0;

  Ps: [P | null, P | null, P | null] = [null, null, null];

  RateRanges: Record<ModeNames, number[]> = [
    "Normal",
    "SuperHHH",
    "GreenWei",
    "PiKaChu",
  ].reduce((Ranges: Record<ModeNames, number[]>, mode: string) => {
    const res: number[] = [];
    let accRate: number = 0;
    for (const p of P.Map.values()) {
      accRate += p.rates[mode as ModeNames];
      res.push(accRate);
    }
    Ranges[mode as ModeNames] = res;
    return Ranges;
  }, {} as Record<ModeNames, number[]>);

  ScoreTimes: Record<ModeNames, number> = {
    Normal: 1,
    SuperHHH: 1,
    GreenWei: 3,
    PiKaChu: 1,
  };
  ScoreTime: number = 1;

  ModeToScreen: boolean = false;

  constructor() {}

  GameRunning(): boolean {
    //遊戲進行
    return this.Times > this.Played;
  }

  NowMode(): ModeNames {
    // 查找當前模式
    const mode = Object.entries(Modes).find(
      ([_, mode]: [string, Mode]) => mode.InMode ?? false
    );
    return mode ? (mode[0] as ModeNames) : "Normal";
  }

  Reset() {
    // 重置
    this.AllData = {};
    this.DataIndex = 0;

    this.Played = 0;
    this.Score = 0;
    this.MarginScore = 0;
    this.ScoreTime = 1;

    this.Ps = [null, null, null];

    Object.values(Modes).forEach((mode: Mode) => {
      if (mode.InMode !== undefined) mode.InMode = false;
      if (mode.Score !== undefined) mode.Score = 0;
      if (mode.RandNum !== undefined) mode.RandNum = 0;
      if (mode.Times !== undefined) mode.Times = 0;
    });
  }

  Random(): void {
    const RandNums: [number, number, number] = Array.from({ length: 3 }, () =>
      RandInt(1, 100)
    ) as [number, number, number];

    RandNums.forEach((RandNum: number, index: number) => {
      this.OneData[`RandNums[${index}]` as `RandNums[${0 | 1 | 2}]`] = RandNum;
    });

    Object.values(Modes).forEach((mode: Mode) => {
      mode.Random?.();
    });
    this.OneData["SuperHHH"] = Modes.SuperHHH.RandNum as number;
    this.OneData["GreenWei"] = Modes.GreenWei.RandNum as number;

    const RateRange: number[] = this.RateRanges[this.NowMode()];
    const PCodes = Array.from(P.Map.keys());
    RandNums.forEach((RandNum: number, i: number) => {
      const code = PCodes.find((_, j: number) => RandNum <= RateRange[j]);
      if (code) {
        this.Ps[i] = P.Map.get(code) ?? null;
      }
    });

    // 累積咖波累積數
    this.Ps.forEach((p) => {
      if (Modes.GreenWei.Score !== undefined) {
        if (p?.code === "A" && Modes.GreenWei.Score < 20) {
          Modes.GreenWei.Score += 1;
        }
      }
    });
  }
  CalculateScore(): void {
    //計算分數
    const UniqueCount: number = new Set(this.Ps.map((p) => p?.code)).size;
    switch (UniqueCount) {
      case 1: // 三個一樣
        this.MarginScore += this.Ps[0]?.scores?.[0] as number;
        break;
      case 2: // 兩個一樣
        if (this.Ps[0]?.code === this.Ps[1]?.code) {
          this.MarginScore += this.Ps[0]?.scores?.[1] as number;
          this.MarginScore += this.Ps[2]?.scores?.[2] as number;
          this.MarginScore = Math.round(this.MarginScore / 1.4);
        } else if (this.Ps[1]?.code === this.Ps[2]?.code) {
          this.MarginScore += this.Ps[1]?.scores?.[1] as number;
          this.MarginScore += this.Ps[0]?.scores?.[2] as number;
          this.MarginScore = Math.round(this.MarginScore / 1.4);
        } else if (this.Ps[2]?.code === this.Ps[0]?.code) {
          this.MarginScore += this.Ps[2]?.scores?.[1] as number;
          this.MarginScore += this.Ps[1]?.scores?.[2] as number;
          this.MarginScore = Math.round(this.MarginScore / 1.4);
        }
        break;
      case 3: // 三個不一樣
        this.MarginScore += this.Ps[0]?.scores?.[2] as number;
        this.MarginScore += this.Ps[1]?.scores?.[2] as number;
        this.MarginScore += this.Ps[2]?.scores?.[2] as number;
        this.MarginScore = Math.round(this.MarginScore / 3);
        break;
    }

    // 根據當前模式更新加分倍數
    this.ScoreTime = this.ScoreTimes[this.NowMode()];
    this.MarginScore *= this.ScoreTime;
  }
  Result(): void {
    // 結果
    this.Played += 1;
    this.DataIndex += 1;
    this.Score += this.MarginScore;
    this.AllData[`${this.DataIndex}`] = this.OneData;
  }
  JudgeMode(): void {
    if (!this.GameRunning()) {
      Modes.PiKaChu.Judge?.(this);
      return;
    }

    const mode: ModeNames = this.NowMode();
    switch (mode) {
      case "Normal":
      case "PiKaChu":
        Modes.SuperHHH.Judge?.(this);
        if (!Modes.SuperHHH.InMode) {
          Modes.GreenWei.Judge?.(this);
        }
        break;
      case "SuperHHH":
        Modes.SuperHHH.Judge?.(this);
        break;
      case "GreenWei":
        Modes.GreenWei.Judge?.(this);
        break;
    }
  }
  Logic(): void {
    // 邏輯流程
    this.Reset();
    while (this.GameRunning()) {
      this.ModeToScreen = false;
      this.OneData = {};

      this.MarginScore = 0;

      this.Random();
      this.CalculateScore();
      this.Result();
      this.JudgeMode();
    }
  }
}
