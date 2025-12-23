import { Mode } from "./mode";
import { patterns } from "./pattern";
import { Pattern, LaBaGEvent, PatternName } from "./types";
import { randInt } from "./utils/randInt";

/**
 * 拉霸遊戲的主要類別。
 */
export class LaBaG {
  /** 總遊玩次數限制 */
  times: number;
  /** 已遊玩次數 */
  played: number;
  /** 當前進行的輪次 */
  rounds: number;
  /** 當前分數 */
  score: number;
  /** 邊際分數 */
  marginScore: number;
  /** 當前轉出的圖案組合 */
  patterns: [Pattern | null, Pattern | null, Pattern | null];
  /** 遊戲模式列表 */
  modes: Mode[];
  /** 事件監聽器列表 */
  eventListeners: Record<LaBaGEvent, ((game: LaBaG) => void)[]>;

  /**
   * 初始化拉霸遊戲。
   * @param times - 總遊玩次數，預設為 30。
   */
  constructor(times: number = 30) {
    this.times = times;
    this.played = 0;
    this.rounds = 0;
    this.score = 0;
    this.marginScore = 0;
    this.patterns = [null, null, null];
    this.modes = [];
    this.eventListeners = {
      gameOver: [],
      gameStart: [],
      roundStart: [],
      roundEnd: [],
      rollSlots: [],
      calculateScore: [],
    };
  }

  /**
   * 觸發指定事件。
   * @param event - 要觸發的事件名稱。
   */
  private emit(event: LaBaGEvent) {
    this.eventListeners[event].forEach((fn) => fn(this));
  }

  /**
   * 新增事件監聽器。
   * @param event - 事件名稱。
   * @param listener - 監聽器函式。
   */
  addEventListener(event: LaBaGEvent, callbackFn: (game: LaBaG) => void) {
    this.eventListeners[event].push(callbackFn);
  }

  /**
   * 新增遊戲模式。
   * @param mode - 要新增的模式。
   */
  addMode(mode: Mode) {
    this.modes.push(mode);
    // 註冊特定模式的監聽器
    Object.entries(mode.eventListener).forEach(([event, listener]) => {
      if (listener) {
        this.addEventListener(event as LaBaGEvent, (game) =>
          listener(game, mode)
        );
      }
    });
  }

  /**
   * 檢查遊戲是否正在進行中（未達次數上限）。
   * @returns 如果遊戲仍在進行中則返回 true，否則返回 false。
   */
  isRunning() {
    return this.played < this.times;
  }

  /**
   * 取得目前遊戲的相關設定
   */
  getCurrentConfig() {
    const activeModes = this.modes.filter((m) => m.active);
    if (activeModes.length === 0) {
      console.warn("目前沒有啟用中的模式，無法轉動拉霸機。");
      return { modes: activeModes, ranges: [] };
    }
    // 合併所有啟用中模式的機率設定
    const combinedRates: Record<PatternName, number> = {
      gss: 0,
      hhh: 0,
      hentai: 0,
      handson: 0,
      kachu: 0,
      rrr: 0,
    };
    activeModes.forEach((mode) => {
      Object.entries(mode.rates).forEach(([patternName, rate]) => {
        combinedRates[patternName as PatternName] += rate;
      });
    });

    // 預先計算合併後的區間
    const ranges: { threshold: number; pattern: Pattern }[] = [];
    let acc = 0;
    for (const pattern of patterns) {
      const rate = combinedRates[pattern.name];
      if (rate !== undefined) {
        acc += rate;
        ranges.push({ threshold: acc, pattern });
      }
    }

    return { modes: activeModes, ranges };
  }

  /**
   * 初始化遊戲狀態。
   */
  init() {
    this.played = 0;
    this.score = 0;
    this.marginScore = 0;
    this.patterns = [null, null, null];
    this.rounds = 0;
    this.emit("gameStart");
  }

  /**
   * 新的一小輪開始。
   */
  private roundStart() {
    this.played += 1;
    this.rounds += 1;
    this.marginScore = 0;
    this.emit("roundStart");
  }

  /**
   * 轉動拉霸機，產生隨機圖案。
   */
  private rollSlots() {
    const { ranges } = this.getCurrentConfig();
    const rangesAcc =
      ranges.length > 0 ? ranges[ranges.length - 1].threshold : 0;
    // 產生 3 個隨機數字
    const randomNums = [
      randInt(1, rangesAcc),
      randInt(1, rangesAcc),
      randInt(1, rangesAcc),
    ];

    randomNums.forEach((num, index) => {
      // 根據預先計算的區間找到對應的圖案
      const match = ranges.find((r) => num <= r.threshold);
      if (match) {
        this.patterns[index] = match.pattern;
      } else {
        this.patterns[index] = null;
      }
    });

    this.emit("rollSlots");
  }

  /**
   * 計算分數。
   */
  private calculateScore() {
    const [p1, p2, p3] = this.patterns;
    if (!p1 || !p2 || !p3) {
      console.warn("圖案未正確生成，無法計算分數。");
      return;
    }
    if (p1.name === p2.name && p2.name === p3.name) {
      // 三個圖案相同
      this.marginScore += p1.scores[0];
    } else if (
      p1.name === p2.name ||
      p2.name === p3.name ||
      p1.name === p3.name
    ) {
      // 兩個圖案相同
      if (p1.name === p2.name) {
        this.marginScore += p1.scores[1];
        this.marginScore += p3.scores[2];
      } else if (p2.name === p3.name) {
        this.marginScore += p2.scores[1];
        this.marginScore += p1.scores[2];
      } else {
        this.marginScore += p1.scores[1];
        this.marginScore += p2.scores[2];
      }
      this.marginScore = Math.round(this.marginScore / 1.4);
    } else {
      // 三個圖案皆不同
      this.marginScore += p1.scores[2];
      this.marginScore += p2.scores[2];
      this.marginScore += p3.scores[2];
      this.marginScore = Math.round(this.marginScore / 3);
    }

    this.emit("calculateScore");
  }

  private roundEnd() {
    this.score += this.marginScore;
    this.emit("roundEnd");
  }

  private gameOver() {
    this.emit("gameOver");
  }

  play() {
    if (!this.isRunning()) {
      console.warn("遊戲次數已達上限，無法繼續遊玩。");
      return;
    }
    this.roundStart();
    this.rollSlots();
    this.calculateScore();
    this.roundEnd();
    if (!this.isRunning()) {
      this.gameOver();
    }
  }
}
