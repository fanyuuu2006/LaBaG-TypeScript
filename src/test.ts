import { LaBaG } from "./labag";
import { Pattern, Payout } from "./types";

const bet = 200;

// Reconstruct Patterns and Payouts for LaBaG class
const patterns: Pattern[] = [
  {
    id: 1,
    weight: 36,
    image:
      "https://fanyu.vercel.app/api/album/item/1mDK1ewfLiV3fAB1HbjvwdSaDTdJdBGG3",
  },
  {
    id: 2,
    weight: 24,
    image:
      "https://fanyu.vercel.app/api/album/item/1oB-uZhPPfjfTtG4CITnb3_E-Ops9JTA0",
  },
  {
    id: 3,
    weight: 17,
    image:
      "https://fanyu.vercel.app/api/album/item/1bMJdRB8uerQZfGYINzBI9Vaw32bZljl2",
  },
  {
    id: 4,
    weight: 12,
    image:
      "https://fanyu.vercel.app/api/album/item/1In8LF1wVfLXpPkp57a20zX84QgsAeLQx",
  },
  {
    id: 5,
    weight: 8,
    image:
      "https://fanyu.vercel.app/api/album/item/1Zo_PjrXm-4TBrL2cLAeFkEl1el9kTR56",
  },
  {
    id: 6,
    weight: 3,
    image:
      "https://fanyu.vercel.app/api/album/item/19NMnVgcb-9IsknNcfe9TpCyPBIcGnhQU",
  },
];
const payouts: Payout[] = [
  { id: 1, match_count: 2, pattern_id: 1, reward: 59 },
  { id: 2, match_count: 3, pattern_id: 1, reward: 257 },
  { id: 3, match_count: 2, pattern_id: 2, reward: 127 },
  { id: 4, match_count: 3, pattern_id: 2, reward: 613 },
  { id: 5, match_count: 2, pattern_id: 3, reward: 283 },
  { id: 6, match_count: 3, pattern_id: 3, reward: 1429 },
  { id: 7, match_count: 2, pattern_id: 4, reward: 607 },
  { id: 8, match_count: 3, pattern_id: 4, reward: 3721 },
  { id: 9, match_count: 2, pattern_id: 5, reward: 2269 },
  { id: 10, match_count: 3, pattern_id: 5, reward: 12457 },
  { id: 11, match_count: 2, pattern_id: 6, reward: 19873 },
  { id: 12, match_count: 3, pattern_id: 6, reward: 193541 },
];

// 分析
// P(X=k) = C(3, k) * p^k * (1-p)^(3-k) 二項分布
// k=3: p^3
// k=2: 3 * p^2 * (1-p)

// 總權重
const totalWeight = patterns.reduce((sum, pattern) => sum + pattern.weight, 0);
// 計算理論期望值 (EV)
let thEV = 0;
for (const payout of payouts) {
  const pattern = patterns.find((p) => p.id === payout.pattern_id);
  if (!pattern) continue;
  const p = pattern.weight / totalWeight;
  const prob =
    payout.match_count === 3 ? Math.pow(p, 3) : 3 * Math.pow(p, 2) * (1 - p);
  thEV += prob * payout.reward;
}
const thRTP = (thEV / bet) * 100;

// 模擬
const SIM_COUNT = 1000000;

const game = new LaBaG(patterns, payouts);
let totalReward = 0;
let winCount = 0;
let maxWin = 0;
const hitFrequency: Record<number, number> = {};

const startTime = Date.now();

for (let i = 0; i < SIM_COUNT; i++) {
  const result = game.spin();
  totalReward += result.reward;

  if (result.reward > 0) {
    winCount++;
    if (result.reward > maxWin) maxWin = result.reward;
    hitFrequency[result.reward] = (hitFrequency[result.reward] || 0) + 1;
  }
}

const endTime = Date.now();
const duration = (endTime - startTime) / 1000;

const simEV = totalReward / SIM_COUNT;
const simRTP = (simEV / bet) * 100;
const hitRate = (winCount / SIM_COUNT) * 100;

console.log(`模擬次數: ${SIM_COUNT}`);
console.log(`總投注: ${bet * SIM_COUNT}`);
console.log(`總獎金: ${totalReward}`);
console.log(`模擬期望值 (EV): ${simEV.toFixed(2)}`);
console.log(`模擬RTP: ${simRTP.toFixed(2)}%`);
console.log(`理論RTP: ${thRTP.toFixed(2)}%`);
console.log(`命中率: ${hitRate.toFixed(2)}%`);
console.log(`最大獎金: ${maxWin}`);
console.log(`獎金分布:`);
for (const reward in hitFrequency) {
  const count = hitFrequency[reward];
  const percentage = ((count / SIM_COUNT) * 100).toFixed(4);
  console.log(`  獎金 ${reward}: ${count} 次 (${percentage}%)`);
}
