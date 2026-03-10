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
  /** 產生的隨機數字 */
  randNums: number[];
  /** 當前轉出的圖案組合 */
  patterns: [Pattern | null, Pattern | null, Pattern | null];
  /** 遊戲模式列表 */
  modes: Mode<Record<string, any>>[];
  /** 事件監聽器列表 */
  eventListeners: Record<LaBaGEvent, ((game: LaBaG) => void)[]>;

  __defaultMode__: Mode<{}, "normal">;

  constructor(times: number = 30) {
    this.times = times;
    this.played = 0;
    this.rounds = 0;
    this.score = 0;
    this.marginScore = 0;
    this.randNums = [];
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

    this.__defaultMode__ = new Mode({
      active: true,
      name: "normal",
      rates: {
        gss: 36,
        hhh: 24,
        hentai: 17,
        handson: 12,
        kachu: 8,
        rrr: 3,
      },
      eventListener: {
        gameStart: (game) => {
          game.played = 0;
          game.rounds = 0;
          game.score = 0;
          game.marginScore = 0;
          game.randNums = [];
          game.patterns = [null, null, null];
        },
        roundStart: (game) => {
          game.played += 1;
          game.rounds += 1;
          game.marginScore = 0;
        },

        rollSlots: (game) => {
          const { ranges } = game.getCurrentConfig();
          const rangesAcc =
            ranges.length > 0 ? ranges[ranges.length - 1].threshold : 0;

          // 產生 3 個隨機數字並直接尋找對應圖案
          for (let i = 0; i < 3; i++) {
            const num = randInt(1, rangesAcc);
            game.randNums[i] = num;

            let matchedPattern: Pattern | null = null;
            for (let j = 0; j < ranges.length; j++) {
              if (num <= ranges[j].threshold) {
                matchedPattern = ranges[j].pattern;
                break;
              }
            }
            game.patterns[i] = matchedPattern;
          }
        },
        calculateScore: (game) => {
          const [p1, p2, p3] = game.patterns;
          if (!p1 || !p2 || !p3) {
            game.marginScore = 0;
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
        },
        roundEnd: (game) => {
          game.score += game.marginScore;
        },
      },
    });
    this.addMode(this.__defaultMode__);
  }

  /**
   * 觸發指定事件。
   * @param event - 要觸發的事件名稱。
   */
  private emit(event: LaBaGEvent) {
    const listeners = this.eventListeners[event];
    for (let i = 0; i < listeners.length; i++) {
      listeners[i](this);
    }
  }

  /**
   * 新增事件監聽器。
   * @param event - 要監聽的事件名稱。
   * @param listener - 事件觸發時要執行的函式。
   * @remarks 可以為同一事件添加多個監聽器，這些監聽器將按照添加的順序依次執行。
   * @example
   * game.addEventListener("gameStart", (game) => {
   *   console.log("遊戲開始了！");
   * });
   * game.addEventListener("roundEnd", (game) => {
   *  console.log("一輪結束了！");
   * });
   */
  addEventListener(event: LaBaGEvent, callbackFn: (game: LaBaG) => void) {
    this.eventListeners[event].push(callbackFn);
  }

  /**
   * 移除事件監聽器。
   * @param event - 要移除監聽器的事件名稱。
   * @param listener - 要移除的監聽器函式。
   * @remarks 這將從指定事件的監聽器列表中移除第一個匹配的函式。
   * @example
   * const onGameStart = (game) => {
   *   console.log("遊戲開始了！");
   * };
   * game.addEventListener("gameStart", onGameStart);
   * // 之後如果想要移除這個監聽器：
   * game.removeEventListener("gameStart", onGameStart);
   */
  removeEventListener(event: LaBaGEvent, callbackFn: (game: LaBaG) => void) {
    const listeners = this.eventListeners[event];
    const index = listeners.indexOf(callbackFn);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * 新增遊戲模式。
   * @param mode - 要新增的遊戲模式實例。
   * @remarks 這將把指定的模式添加到遊戲的模式列表中，並自動註冊該模式定義的事件監聽器。
   * @example
   * const myMode = new Mode({
   *  active: false,
   * name: "myMode",
   * rates: {
   *  gss: 10,
   *  hhh: 20,
   *  hentai: 30,
   *  handson: 20,
   *  kachu: 10,
   *  rrr: 10,
   * },
   * });
   * game.addMode(myMode);
   */
  addMode(mode: Mode<any>) {
    this.modes.push(mode);
    // 註冊特定模式的監聽器
    Object.entries(mode.eventListener).forEach(([event, listener]) => {
      if (listener) {
        this.addEventListener(event as LaBaGEvent, (game) =>
          listener(game, mode),
        );
      }
    });
  }

  /**
   * 取得目前遊戲的相關設定
   */
  getCurrentConfig() {
    const activeModes = this.modes.filter((m) => m.active);
    if (activeModes.length === 0) {
      throw new Error("目前沒有啟用中的模式，無法轉動拉霸機。");
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
    for (let i = 0; i < activeModes.length; i++) {
      const mode = activeModes[i];
      for (const patternName in mode.rates) {
        combinedRates[patternName as PatternName] +=
          mode.rates[patternName as PatternName];
      }
    }

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

  init() {
    this.emit("gameStart");
  }

  roundStart() {
    this.emit("roundStart");
  }

  rollSlots() {
    this.emit("rollSlots");
  }

  calculateScore() {
    this.emit("calculateScore");
  }

  roundEnd() {
    this.emit("roundEnd");
  }

  gameOver() {
    this.emit("gameOver");
  }

  play() {
    if (!this.isRunning) {
      throw new Error("遊戲已結束，無法繼續遊玩。");
    }
    this.roundStart();
    this.rollSlots();
    this.calculateScore();
    this.roundEnd();
    if (!this.isRunning) {
      this.gameOver();
    }
  }

  get isRunning() {
    return this.played < this.times;
  }
}
