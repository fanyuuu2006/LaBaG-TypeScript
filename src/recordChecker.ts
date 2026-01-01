import { LaBaG } from "./labag";
import { GameRecord } from "./recorder";

export class RecordChecker {
  private game: LaBaG;

  constructor(game: LaBaG) {
    this.game = game;
  }

  /**
   * 驗證紀錄的分數是否正確。
   * @param record - 要驗證的遊戲紀錄。
   * @returns 如果計算出的分數與紀錄中的分數一致則返回 true，否則返回 false。
   */
  check(record: GameRecord): boolean {
    const calculatedScore = this.calculateScore(record);
    return calculatedScore === record.score;
  }

  /**
   * 根據紀錄還原並計算分數。
   * @param record - 遊戲紀錄。
   * @returns 計算出的分數。
   */
  calculateScore(record: GameRecord): number {
    // 重置遊戲狀態
    this.game.init();
    this.game.times = record.times;

    // 使用 any 類型來存取私有方法
    const gameAny = this.game as any;

    for (const round of record.rounds) {
      if (!this.game.isRunning()) {
        throw new Error("遊戲次數已達上限，無法繼續遊玩。");
      }

      // 1. 回合開始
      gameAny.roundStart();

      // 2. 設定隨機數字與圖案 (模擬 rollSlots)
      const { ranges } = this.game.getCurrentConfig();
      
      this.game.randNums = [
        round.randNums["0"],
        round.randNums["1"],
        round.randNums["2"],
      ];

      this.game.randNums.forEach((num, index) => {
        const match = ranges.find((r) => num <= r.threshold);
        if (match) {
          this.game.patterns[index] = match.pattern;
        } else {
          this.game.patterns[index] = null;
        }
      });

      // 觸發 rollSlots 事件，讓模式執行其邏輯 (例如 greenwei 產生隨機數)
      gameAny.emit("rollSlots");

      // 3. 覆蓋模式的隨機變數 (確保使用紀錄中的數值)
      this.game.modes.forEach((mode) => {
        if (round.randNums[mode.name] !== undefined) {
          mode.variable.randNum = round.randNums[mode.name];
        }
      });

      // 4. 計算分數
      gameAny.calculateScore();

      // 5. 回合結束
      gameAny.roundEnd();
    }

    if (!this.game.isRunning()) {
      gameAny.gameOver();
    }

    return this.game.score;
  }
}

