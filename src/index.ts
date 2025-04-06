import PDatas from "@/json/PDatas.json";
import { P, PData } from "@/types/P";
import { LaBaG } from "./types/LaBaG";
import { Mode, ModeNames } from "./types/Mode";
import { RandInt } from "./utils/RandInt";
import { PlayLaBaG } from "./types/PlayLaBaG";
import { JsonLaBaG } from "./types/JsonLaBaG";

Object.values(PDatas).forEach((Pdata: PData) => {
  new P(Pdata.code, Pdata.scores, Pdata.rates);
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
          if (Modes.PiKaChu.InMode) {
            Modes.PiKaChu.InMode = false;
          }
          // 超級阿禾加倍
          if (Game.Ps.every((p) => p?.Code === "B")) {
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
        if (
          this.RandNum <= this.Rate &&
          Game.Ps.every((p) => p?.Code === "A")
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
  },
};

export { LaBaG, PlayLaBaG, JsonLaBaG, Modes, ModeNames, P, PData, PDatas };
