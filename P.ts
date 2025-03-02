type Mode = "Normal" | "SuperHHH" | "GreenWei" | "PiKaChu";

export const DefaultRates: Record<Mode, number> = {
  Normal: 0,
  SuperHHH: 0,
  GreenWei: 0,
  PiKaChu: 0,
};


export class P {
  static Obj: Record<string, P> = {};

  Code: string | null;
  Scores: number[];
  Rates: Record<Mode, number>;
  constructor(
    Code: string | null = null,
    Scores: number[] = [0, 0, 0],
    Rates: Record<Mode, number> = DefaultRates
  ) {
    this.Code = Code;
    this.Scores = Scores;
    this.Rates = Rates;

    if (this.Code && !P.Obj[this.Code]) {
      P.Obj[this.Code] = this;
    }
  }
}
