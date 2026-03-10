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
    // 警告：此操作會重置並覆蓋當前傳入的遊戲實例狀態
    this.game.init();
    this.game.times = record.times;

    for (const round of record.rounds) {
      if (!this.game.isRunning) {
        throw new Error("遊戲次數已達上限，無法繼續遊玩。");
      }

      // 1. 回合開始
      this.game["roundStart"]();

      // 2. 設定隨機數字與圖案 (模擬 rollSlots)
      const { ranges } = this.game.getCurrentConfig();

      for (let i = 0; i < 3; i++) {
        const num = round.randNums?.[i.toString()] ?? 0;
        this.game.randNums[i] = num;

        const match = ranges.find((r) => num <= r.threshold);
        this.game.patterns[i] = match ? match.pattern : null;
      }

      // 觸發 rollSlots 事件，讓模式執行其邏輯 (例如 greenwei 產生隨機數)
      this.game["emit"]("rollSlots");

      // 3. 覆蓋模式的隨機變數 (確保使用紀錄中的數值)
      this.game.modes.forEach((mode) => {
        const recordedNum = round.randNums?.[mode.name];
        if (recordedNum !== undefined && mode.variable) {
          mode.variable.randNum = recordedNum;
        }
      });

      // 4. 計算分數
      this.game["calculateScore"]();

      // 5. 回合結束
      this.game["roundEnd"]();
    }

    if (!this.game.isRunning) {
      this.game["gameOver"]();
    }

    return this.game.score;
  }
}
