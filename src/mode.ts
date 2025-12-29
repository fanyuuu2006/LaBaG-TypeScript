import { LaBaG } from "./labag";
import { patterns } from "./pattern";
import { LaBaGEvent, Pattern, PatternName } from "./types";

/**
 * 代表遊戲的一種模式，包含機率設定和事件監聽器。
 */
export class Mode{
  /** 模式是否啟用 */
  active: boolean;
  /** 模式名稱 */
  name: string;
  /** 各圖案出現的機率 */
  rates: Record<PatternName, number>;
  // 預先計算的區間，用於高效查找
  ranges: { threshold: number; pattern: Pattern }[];
  /** 事件監聽器 */
  eventListener: Partial<
    Record<LaBaGEvent, (game: LaBaG, mode: Mode) => void>
  >;

  /** 模式專屬的變數儲存空間 */
  variable: Record<string, any>;
  /** 機率總和 */

  /**
   * 建立一個新的模式。
   * @param active - 是否啟用此模式。
   * @param name - 模式名稱。
   * @param rates - 各圖案的機率設定。
   * @param eventListener - 事件監聽器。
   */
  constructor(
    active: boolean,
    name: string,
    rates: Record<PatternName, number>,
    eventListener?: Partial<
      Record<LaBaGEvent, (game: LaBaG, mode: Mode) => void>
    >,
    variable?: Record<string, any>
  ) {
    this.active = active;
    this.name = name;
    this.rates = rates;
    this.eventListener = eventListener ?? {};
    this.variable = variable ?? {};

    // 預先計算機率區間
    this.ranges = [];
    let acc = 0;
    // 遍歷定義的圖案以確保順序一致
    for (const pattern of patterns) {
      const rate = rates[pattern.name];
      if (rate !== undefined) {
        acc += rate;
        this.ranges.push({ threshold: acc, pattern });
      }
    }
  }
}
