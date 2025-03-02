import { ModeNames } from "./Mode";

export const DefaultRates: Record<ModeNames, number> = {
  Normal: 0,
  SuperHHH: 0,
  GreenWei: 0,
  PiKaChu: 0,
};

export class P {
  static Obj: Record<string, P> = {};

  Code: string | null;
  Scores: [number, number, number];
  Rates: Record<ModeNames, number>;
  constructor(
    Code: string | null = null,
    Scores: [number, number, number] = [0, 0, 0],
    Rates: Record<ModeNames, number> = { ...DefaultRates }
  ) {
    this.Code = Code;
    this.Scores = Scores;
    this.Rates = Rates;

    if (this.Code && !P.Obj[this.Code]) {
      P.Obj[this.Code] = this;
    }
  }
}

export const Gss: P = new P("A", [625, 350, 150], {
  Normal: 36,
  SuperHHH: 19,
  GreenWei: 36,
  PiKaChu: 36,
});

export const Hhh: P = new P("B", [1250, 650, 220], {
  Normal: 24,
  SuperHHH: 5,
  GreenWei: 24,
  PiKaChu: 24,
});

export const Hental: P = new P("C", [2100, 1080, 380], {
  Normal: 17,
  SuperHHH: 19,
  GreenWei: 17,
  PiKaChu: 17,
});

export const Handsun: P = new P("D", [2500, 1250, 420], {
  Normal: 12,
  SuperHHH: 19,
  GreenWei: 12,
  PiKaChu: 12,
});

export const Kachu: P = new P("E", [10000, 5000, 1250], {
  Normal: 8,
  SuperHHH: 19,
  GreenWei: 8,
  PiKaChu: 8,
});

export const Rrr: P = new P("F", [20000, 10000, 2500], {
  Normal: 3,
  SuperHHH: 19,
  GreenWei: 3,
  PiKaChu: 3,
});
