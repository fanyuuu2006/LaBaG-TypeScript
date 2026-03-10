import { LaBaG } from "./labag";
import { patterns } from "./pattern";
import { LaBaGEvent, Pattern, PatternName } from "./types";
interface ModeConfig<
  VariableType extends Record<string, any>,
  N extends string = string,
> {
  active: boolean;
  name: N;
  rates: Record<PatternName, number>;
  eventListener?: Partial<
    Record<LaBaGEvent, (game: LaBaG, mode: Mode<VariableType>) => void>
  >;
  variable?: VariableType;
}

/**
 * 代表遊戲的一種模式，包含機率設定和事件監聽器。
 */
export class Mode<
  VariableType extends Record<string, any> = Record<string, any>,
  N extends string = string,
> implements ModeConfig<VariableType, N> {
  /** 模式是否啟用 */
  active: boolean;
  /** 模式名稱 */
  name: N;
  /** 各圖案出現的機率 */
  rates: Record<PatternName, number>;
  // 預先計算的區間，用於高效查找
  ranges: { threshold: number; pattern: Pattern }[];
  /** 事件監聽器 */
  eventListener: Partial<
    Record<LaBaGEvent, (game: LaBaG, mode: Mode<VariableType>) => void>
  >;

  /** 模式專屬的變數儲存空間 */
  variable: VariableType;
  /** 機率總和 */

  /**
   * 建立一個新的遊戲模式。
   * @param config 模式的設定，包括啟用狀態、名稱、機率、事件監聽器和專屬變數。
   * @remarks 會根據提供的機率設定預先計算出對應的區間，以便在遊戲中快速查找圖案。
   * @example
   * const myMode = new Mode({
   *   active: false,
   *   name: "myMode",
   *  rates: {
   *    gss: 10,
   *   hhh: 20,
   *   hentai: 30,
   *   handson: 20,
   *   kachu: 10,
   *   rrr: 10,
   * },
   *  eventListener: {
   *   gameStart: (game, mode) => {
   *    console.log("遊戲開始了！", mode.name);
   * },
   *  roundEnd: (game, mode) => {
   *   console.log("一輪結束了！", mode.name);
   * },
   * },
   * variable: {
   *  myCustomValue: 123,
   * },
   * });
   */
  constructor(config: ModeConfig<VariableType, N>) {
    const { active, name, rates, eventListener, variable } = config;
    this.active = active;
    this.name = name;
    this.rates = rates;
    this.eventListener = eventListener ?? {};
    this.variable = variable ?? ({} as VariableType);

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
