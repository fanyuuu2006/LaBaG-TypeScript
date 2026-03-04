import { LaBaG } from "./labag";

export type RoundRecord = {
  readonly randNums: Readonly<Record<string, number>>;
};

export type GameRecord = {
  times: number;
  score: number;
  readonly rounds: ReadonlyArray<RoundRecord>;
};

export type RecorderOptions = {
  debug?: boolean; // 若為 true，會以 console.debug 輸出紀錄
};
export class Recorder {
  private game: LaBaG;
  #rounds: RoundRecord[] = [];
  private score: number = 0;
  private started = false;
  private debug = false;

  constructor(gameInstance: LaBaG, options?: RecorderOptions) {
    this.game = gameInstance;
    this.debug = options?.debug ?? false;
  }

  get rounds(): ReadonlyArray<RoundRecord> {
    return this.#rounds;
  }

  private onRoundEnd = (g: LaBaG) => {
    const randNums: Record<string, number> = {};

    g.randNums.forEach((value, key) => {
      if (typeof value === "number" && !Number.isNaN(value)) {
        randNums[key] = value;
      }
    });

    // 收集各模式的 randNum（若為數值且有效）
    g.modes.forEach((mode) => {
      const rn = mode?.variable?.randNum;
      if (typeof rn === "number" && !Number.isNaN(rn)) {
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
  };

  init(clearExisting = true) {
    if (this.started) return;
    if (clearExisting) {
      this.clear();
    }
    if (typeof this.game.addEventListener === "function") {
      this.game.addEventListener("roundEnd", this.onRoundEnd);
      this.started = true;
    }
  }

  dispose() {
    if (!this.started) return;
    this.game.removeEventListener("roundEnd", this.onRoundEnd);
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
