import { Pattern, Payout } from "./types";
import { randInt } from "./utils/randInt";

export class LaBaG {
  patterns: Pattern[];
  reels: Pattern[];
  payouts: Payout[];

  constructor(patterns: Pattern[], payouts: Payout[]) {
    this.patterns = patterns;
    this.reels = [patterns[0], patterns[1], patterns[2]];
    this.payouts = payouts;
  }
  spin(bet: number): { reels: Pattern[]; reward: number; multiplier: number } {
    this.reels = [
      this.randomPattern(),
      this.randomPattern(),
      this.randomPattern(),
    ];
    const multiplier = this.calculateMultiplier(this.reels);
    const reward = Math.floor(bet * multiplier);
    return {
      reels: this.reels,
      reward,
      multiplier,
    };
  }

  randomPattern(): Pattern {
    const totalWeight = this.patterns.reduce(
      (sum, pattern) => sum + pattern.weight,
      0,
    );
    const randNum = randInt(1, totalWeight);
    let cumulativeWeight = 0;
    for (const pattern of this.patterns) {
      cumulativeWeight += pattern.weight;
      if (randNum <= cumulativeWeight) {
        return pattern;
      }
    }
    throw new Error("No pattern found");
  }

  calculateMultiplier(reels: Pattern[]): number {
    const patternCounts: { [key: string]: number } = {};
    for (const pattern of reels) {
      patternCounts[pattern.id] = (patternCounts[pattern.id] || 0) + 1;
    }

    let totalMultiplier = 0;
    for (const payout of this.payouts) {
      if (patternCounts[payout.pattern_id] === payout.match_count) {
        totalMultiplier += payout.multiplier;
      }
    }
    return totalMultiplier;
  }
}
