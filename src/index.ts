import { LaBaG, OneDataType, AllDataType } from "./types/LaBaG";
import { Mode, ModeNames } from "./types/Mode";
import { RandInt } from "./utils/RandInt";
import { PlayLaBaG } from "./types/PlayLaBaG";
import { JsonLaBaG } from "./types/JsonLaBaG";
import { P, PData } from "./types/P";
import { parseScore, verifyScore } from './utils/data';

const PDatas: Record<string, PData> = {
  Gss: {
    name: "咖波",
    code: "A",
    rates: { Normal: 36, SuperHHH: 19, GreenWei: 36, PiKaChu: 36 },
    scores: [800, 400, 180],
  },
  Hhh: {
    name: "阿禾",
    code: "B",
    rates: { Normal: 24, SuperHHH: 5, GreenWei: 24, PiKaChu: 24 },
    scores: [1500, 800, 300],
  },
  Hentai: {
    name: "猥褻男",
    code: "C",
    rates: { Normal: 17, SuperHHH: 19, GreenWei: 17, PiKaChu: 17 },
    scores: [2500, 1200, 500],
  },
  Handsun: {
    name: "文傑",
    code: "D",
    rates: { Normal: 12, SuperHHH: 19, GreenWei: 12, PiKaChu: 12 },
    scores: [2900, 1450, 690],
  },
  Kachu: {
    name: "皮卡丘",
    code: "E",
    rates: { Normal: 8, SuperHHH: 19, GreenWei: 8, PiKaChu: 8 },
    scores: [12000, 8000, 1250],
  },
  Rrr: {
    name: "館長",
    code: "F",
    rates: { Normal: 3, SuperHHH: 19, GreenWei: 3, PiKaChu: 3 },
    scores: [20000, 12000, 2500],
  },
};

Object.values(PDatas).forEach((pd: PData) => {
  new P(pd.name, pd.code, pd.scores, pd.rates);
});

const Modes: Record<Exclude<ModeNames, "Normal">, Mode> = {
  // 超級阿禾
  SuperHHH: {
    InMode: false,
    Rate: 15,
    Times: 0,
    Score: 0,
    RandNum: 0,
    Random(): void {
      this.RandNum = RandInt(1, 100);
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

        if (Game.Ps.every((p) => p?.code === "B")) {
          this.Times += 2;
        }
        if (this.Times <= 0) {
          this.InMode = false;
          Game.JudgeMode();
          Game.ModeToScreen = true;
        }
      } else {
        if (this.RandNum <= this.Rate && Game.Ps.some((p) => p?.code === "B")) {
          this.InMode = true;
          this.Times += 6;
          Game.ModeToScreen = true;
          if (Modes.PiKaChu.InMode) {
            Modes.PiKaChu.InMode = false;
          }
          // 超級阿禾加倍
          if (Game.Ps.every((p) => p?.code === "B")) {
            this.Score = Math.round((Game.Score * Game.ScoreTime) / 2);
            Game.MarginScore += this.Score;
          }
        }
      }
    },
  },

  GreenWei: {
    InMode: false,
    Rate: 35,
    Times: 0,
    Score: 0, // 咖波累積數
    RandNum: 0,
    Random(): void {
      this.RandNum = RandInt(1, 100);
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

        if (Game.Ps.every((p) => p?.code === "A")) {
          this.Times += 1;
        }
        if (this.Times <= 0) {
          this.InMode = false;
          Game.JudgeMode();
          Game.ModeToScreen = true;
        }
      } else {
        if (
          this.RandNum <= this.Rate &&
          Game.Ps.every((p) => p?.code === "A")
        ) {
          this.InMode = true;
          this.Times += 2;
          Game.ModeToScreen = true;
          if (Modes.PiKaChu.InMode) {
            Modes.PiKaChu.InMode = false;
          }
          return;
        } else if (this.Score >= 20) {
          // 咖波累積數達到 20
          this.InMode = true;
          this.Times += 2;
          this.Score = 0;
          Game.ModeToScreen = true;
          if (Modes.PiKaChu.InMode) {
            Modes.PiKaChu.InMode = false;
          }
          return;
        }
      }
    },
  },

  PiKaChu: {
    InMode: false,
    Times: 0,
    Judge(Game: LaBaG) {
      if (!Game.GameRunning() && this.Times !== undefined) {
        // 關掉其他模式
        Modes.SuperHHH.InMode = false;
        Modes.GreenWei.InMode = false;
        if (Game.Ps.some((p) => p?.code === "E")) {
          this.InMode = true;
          Game.Played -= 5;
          this.Times += 1;
          Game.ModeToScreen = true;
        } else {
          this.InMode = false;
        }
      }
    },
  },
};

export {
  OneDataType,
  AllDataType,
  LaBaG,
  PlayLaBaG,
  JsonLaBaG,

  Modes,
  ModeNames,

  P,
  PData,
  PDatas,

  parseScore,
  verifyScore,
};
