import { LaBaG } from "./LaBaG";
import { RandInt } from "./RandInt";

export type Mode = {
  InMode: boolean;
  Rate?: number;
  Times?: number;
  Score?: number;
  RandNum?: number;
  Random?(): void;
  Judge(Game: LaBaG): void;
};

// 超級阿禾
const SuperHHH: Mode = {
  InMode: false,
  Rate: 15,
  Times: 0,
  Score: 0,
  RandNum: 0,
  Random(): void {
    this.RandNum = RandInt();
  },
  Judge(Game: LaBaG): void {
    if (
      !Game.GameRunning() ||
      this.RandNum === undefined ||
      this.Times === undefined ||
      this.Rate === undefined ||
      this.Score === undefined
    ) {
      return;
    }

    this.Score = 0; // Reset score
    if (this.InMode) {
      this.Times -= 1;

      if (Game.Ps.every((p) => p?.Code === "B")) {
        this.Times += 2;
      }
      if (this.Times <= 0) {
        this.InMode = false;
        Game.JudgeMode();
        Game.ModeToScreen = true;
      }
    } else {
      if (this.RandNum <= this.Rate && Game.Ps.some((p) => p?.Code === "B")) {
        this.InMode = true;
        this.Times += 6;
        Game.ModeToScreen = true;
        if (PiKaChu.InMode) {
          PiKaChu.InMode = false;
        }
        // 超級阿禾加倍
        if (Game.Ps.every((p) => p?.Code === "B")) {
          this.Score = Math.round((Game.Score * Game.ScoreTime) / 2);
          Game.MarginScore += this.Score;
        }
      }
    }
  },
};

const GreenWei: Mode = {
  InMode: false,
  Rate: 35,
  Times: 0,
  Score: 0, // 咖波累積數
  RandNum: 0,
  Random(): void {
    this.RandNum = RandInt();
  },
  Judge(Game: LaBaG): void {
    if (
      !Game.GameRunning() ||
      this.RandNum === undefined ||
      this.Times === undefined ||
      this.Rate === undefined ||
      this.Score === undefined
    ) {
      return;
    }

    if (this.InMode) {
      this.Times -= 1;

      if (Game.Ps.every((p) => p?.Code === "A")) {
        this.Times += 1;
      }
      if (this.Times <= 0) {
        this.InMode = false;
        Game.JudgeMode();
        Game.ModeToScreen = true;
      }
    } else {
      if (this.RandNum <= this.Rate && Game.Ps.every((p) => p?.Code === "A")) {
        this.InMode = true;
        this.Times += 2;
        Game.ModeToScreen = true;
        if (PiKaChu.InMode) {
          PiKaChu.InMode = false;
        }
        return;
      } else if (this.Score >= 20) {
        // 咖波累積數達到 20
        this.InMode = true;
        this.Times += 2;
        this.Score = 0;
        Game.ModeToScreen = true;
        if (PiKaChu.InMode) {
          PiKaChu.InMode = false;
        }
        return;
      }
    }
  },
};

const PiKaChu: Mode = {
  InMode: false,
  Times: 0,
  Judge(Game: LaBaG) {
    if (!Game.GameRunning() && this.Times !== undefined) {
      // 關掉其他模式
      SuperHHH.InMode = false;
      GreenWei.InMode = false;
      if (Game.Ps.some((p) => p?.Code === "E")) {
        this.InMode = true;
        Game.Played -= 5;
        this.Times += 1;
        Game.ModeToScreen = true;
      } else {
        this.InMode = false;
      }
    }
  },
};

export const Modes: Record<string, Mode> = { SuperHHH, GreenWei, PiKaChu };
export type ModeNames = keyof typeof Modes | "Normal";
