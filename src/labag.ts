import { Pattern, Payout } from "./types";
import { randInt } from "./utils/randInt";


export class LaBaG {
  patterns: Pattern[];
  reel: Pattern[];
  payouts: Payout[];

  constructor(patterns: Pattern[], payouts: Payout[]) {
    this.patterns = patterns;
    this.reel = [patterns[0], patterns[1], patterns[2]];
    this.payouts = payouts;
  }
  spin() {
    this.reel = [
      this.randomPattern(),
      this.randomPattern(),
      this.randomPattern(),
    ];
    const reward = this.caculateReward(this.reel);
    return {
      reel: this.reel,
      reward,
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

  caculateReward(reels: Pattern[]): number {
    const patternCounts: { [key: string]: number } = {};
    for (const pattern of reels) {
      patternCounts[pattern.id] = (patternCounts[pattern.id] || 0) + 1;
    }
    let totalReward = 0;
    for (const payout of this.payouts) {
      if (patternCounts[payout.pattern_id] === payout.match_count) {
        totalReward += payout.reward;
      }
    }
    return totalReward;
  }
}
