import { LaBaGEvent, Pattern } from "./types";
import { randInt } from "./utils/randInt";

/**
 * 定義遊戲中可用的圖案及其分數。
 */
export const patterns = [
  {
    name: "gss",
    scores: [800, 400, 180],
  },
  {
    name: "hhh",
    scores: [1500, 800, 300],
  },
  {
    name: "hentai",
    scores: [2500, 1200, 500],
  },
  {
    name: "handson",
    scores: [2900, 1450, 690],
  },
  {
    name: "kachu",
    scores: [12000, 8000, 1250],
  },
  {
    name: "rrr",
    scores: [20000, 12000, 2500],
  },
] as const satisfies readonly Pattern[];

/**
 * 圖案名稱的型別。
 */
export type PatternName = (typeof patterns)[number]["name"];

/**
 * 代表遊戲的一種模式，包含機率設定和事件監聽器。
 */
export class Mode {
  /** 模式是否啟用 */
  active: boolean;
  /** 模式名稱 */
  name: string;
  /** 各圖案出現的機率 */
  rates: Record<PatternName, number>;
  // 預先計算的區間，用於高效查找
  ranges: { threshold: number; pattern: Pattern }[];
  /** 事件監聽器 */
  eventListener: Partial<Record<LaBaGEvent, (game: LaBaG, mode: Mode) => void>>;

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
    if (acc > 100) {
      console.warn(`模式 "${name}" 的機率總和超過 100%，請檢查設定。`);
    }
  }
}

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
   * 取得所有啟用中的模式。
   * @returns 啟用中的模式陣列。
   */
  getActiveModes() {
    return this.modes.filter((m) => m.active);
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
    const modes = this.getActiveModes();
    if (modes.length === 0) {
      console.warn("目前沒有啟用中的模式，無法轉動拉霸機。");
      return;
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
    modes.forEach((mode) => {
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

    console.log(ranges);

    // 產生 3 個隨機數字
    const randomNums = [randInt(1, acc), randInt(1, acc), randInt(1, acc)];

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
