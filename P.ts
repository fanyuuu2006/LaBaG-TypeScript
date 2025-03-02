type Mode = "Normal" | "SuperHHH" | "GreenWei" | "PiKaChu";

class P {
  static Obj: Record<string, P> = {};

  Code: string | null;
  Scores: number[];
  Rates: Record<string, number>;
  constructor(
    Code: string | null = null,
    Scores: number[] = [0, 0, 0],
    Rates: Record<Mode, number> = {
      Normal: 0,
      SuperHHH: 0,
      GreenWei: 0,
      PiKaChu: 0,
    }
  ) {
    this.Code = Code;
    this.Scores = Scores;
    this.Rates = Rates;
  }
}
