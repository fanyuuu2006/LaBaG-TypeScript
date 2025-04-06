import { ModeNames } from "./Mode";

// 定義 ModeRates 類型，方便重用
type ModeRates = Record<ModeNames, number>;

export interface PData {
  name: string;
  code: string;
  rates: ModeRates;
  scores: [number, number, number];
}

export class P implements PData {
  static Map: Map<string, P> = new Map();
  name: string;
  code: string;
  scores: [number, number, number];
  rates: ModeRates;

  constructor(
    name = "",
    code: string,
    scores: [number, number, number] = [0, 0, 0],
    rates: ModeRates = {
      Normal: 0,
      SuperHHH: 0,
      GreenWei: 0,
      PiKaChu: 0,
    }
  ) {
    this.name = name;
    this.code = code;
    this.scores = scores;
    this.rates = rates;

    if (this.code && !P.Map.has(this.code)) {
      P.Map.set(this.code, this);
    }
  }
}
