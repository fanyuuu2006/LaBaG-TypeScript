import { LaBaG } from "./labag";

export type RoundRecord = {
  randNums: Record<string, number>;
};

export type GameRecord = {
  times: number;
  score: number;
  rounds: RoundRecord[];
};

export type RecorderOptions = {
  debug?: boolean; // 若為 true，會以 console.debug 輸出紀錄
};
export class Recorder {
  private game: LaBaG;
  #rounds: RoundRecord[] = [];
  private score: number = 0;
  private onRoundEndBound: (e: LaBaG) => void;
  private started = false;
  private debug = false;

  constructor(gameInstance: LaBaG, options?: RecorderOptions) {
    this.game = gameInstance;
    this.onRoundEndBound = this.onRoundEnd.bind(this);
    this.debug = !!options?.debug;
  }

  get rounds() {
    return this.#rounds.map((r) => ({ ...r }));
  }

  private onRoundEnd(g: LaBaG) {
    const randNums: Record<string, number> = {};

    g.randNums.forEach((value, key) => {
      if (!isNaN(value)) {
        randNums[key] = value;
      }
    });

    // 收集各模式的 randNum（若為數值且有效）
    g.modes.forEach((mode) => {
      const rn = mode?.variable?.randNum;
      if (!isNaN(rn)) {
        randNums[mode.name] = rn;
      }
    });

    const round: RoundRecord = {
      randNums,
    };

    if (this.debug)
      console.debug("recorder:onRoundEnd", {
        round,
        score: g.score,
      });

    this.#rounds.push(round);
    this.score = g.score;
  }

  init(clearExisting = true) {
    if (this.started) return;
    if (clearExisting) {
      this.clear();
    }
    if (typeof this.game.addEventListener === "function") {
      this.game.addEventListener("roundEnd", this.onRoundEndBound);
      this.started = true;
    }
  }

  dispose() {
    if (!this.started) return;
    this.game.removeEventListener("roundEnd", this.onRoundEndBound);
    this.started = false;
  }
  clear() {
    if (this.debug) console.debug("clear");
    this.score = 0;
    this.#rounds = [];
  }

  getRecord(): GameRecord {
    if (this.debug) console.debug("get");
    return {
      times: this.game.times,
      score: this.score,
      rounds: this.#rounds,
    };
  }
}
