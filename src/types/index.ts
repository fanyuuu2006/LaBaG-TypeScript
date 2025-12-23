/**
 * 拉霸遊戲的事件類型。
 */
export type LaBaGEvent =
  | "gameOver"
  | "gameStart"
  | "roundStart"
  | "roundEnd"
  | "rollSlots"
  | "calculateScore";

/**
 * 代表一個圖案及其對應的分數。
 */
export type Pattern = {
  /** 圖案名稱 */
  name: string;
  /** 對應的分數陣列 */
  scores: number[];
};
