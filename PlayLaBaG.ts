import { BaseLaBaG } from "./LaBaG";
import { ModeNames, Modes } from "./Mode";

export class PlayLaBaG extends BaseLaBaG {
  Name: string = "";
  HistoryScore: number = 0;

  constructor() {
    super();
  }

  Reset(): void {
    super.Reset();
    this.HistoryScore = 0;
    console.log("遊戲已重置");
  }

  Random(): void {
    super.Random();
    console.log(`機率區間: ${this.RateRanges[this.NowMode()]}`);
    console.log(`超級阿禾隨機數為: ${Modes.SuperHHH.RandNum}`);
    console.log(`綠光阿瑋隨機數為: ${Modes.GreenWei.RandNum}`);
    console.log(`咖波累積數：${Modes.GreenWei.Score}`);
  }

  CalculateScore(): void {
    super.CalculateScore();
    console.log(`加分倍數: ${this.ScoreTime}`);
  }

  Result(): void {
    super.Result();
    console.log("");
    console.log(
      `| ${this.Ps[0]?.Code} | ${this.Ps[1]?.Code} | ${this.Ps[2]?.Code} |`
    );
    console.log(`+ ${this.MarginScore}`);
    console.log(`目前分數: ${this.Score}`);
    console.log(`剩餘次數: ${this.Times - this.Played}`);
  }

  JudgeMode(): void {
    super.JudgeMode();
    const mode: ModeNames = this.NowMode();
    switch (mode) {
      case "SuperHHH":
        if (this.ModeToScreen) {
          console.log("超級阿禾出現");
          if (Modes.SuperHHH.Score !== 0) {
            console.log(`(超級阿禾加倍分: ${Modes.SuperHHH.Score})`);
          }
        } else {
          if (this.Ps.every((p) => p?.Code === "B")) {
            console.log("全阿禾，次數不消耗且+1！");
          }
        }
        console.log(`超級阿禾剩餘次數:${Modes.SuperHHH.Times}次`);
        break;
      case "GreenWei":
        if (this.ModeToScreen) {
          console.log("綠光阿瑋出現");
        } else {
          if (this.Ps.every((p) => p?.Code === "A")) {
            console.log("全咖波，次數不消耗！");
          }
        }
        console.log(`綠光阿瑋剩餘次數:${Modes.GreenWei.Times}次`);
        break;
      case "PiKaChu":
        if (this.ModeToScreen) {
          console.log("皮卡丘為你充電");
          console.log(`已觸發 ${Modes.PiKaChu.Times} 次皮卡丘充電`);
        }
        break;
    }
  }

  Logic(): void {
    this.ModeToScreen = false;
    this.OneData = {};
    this.MarginScore = 0;
    this.Random();
    this.CalculateScore();
    this.Result();
    this.JudgeMode();
  }
}

export const Game: PlayLaBaG = new PlayLaBaG();