import { LaBaG } from "./labag";
import { Pattern, Payout } from "./types";

// --- 設定 (Configuration) ---
const BET_AMOUNT = 1000;
const SIMULATION_COUNT = 1000000;

// --- 資料定義 (Data Definitions) ---

export const patterns: Pattern[] = [
  {
    id: "1",
    weight: 36,
    image:
      "https://fanyu.vercel.app/api/album/item/1mDK1ewfLiV3fAB1HbjvwdSaDTdJdBGG3",
  },
  {
    id: "2",
    weight: 24,
    image:
      "https://fanyu.vercel.app/api/album/item/1oB-uZhPPfjfTtG4CITnb3_E-Ops9JTA0",
  },

  {
    id: "3",
    weight: 17,
    image:
      "https://fanyu.vercel.app/api/album/item/1bMJdRB8uerQZfGYINzBI9Vaw32bZljl2",
  },
  {
    id: "4",
    weight: 12,
    image:
      "https://fanyu.vercel.app/api/album/item/1In8LF1wVfLXpPkp57a20zX84QgsAeLQx",
  },

  {
    id: "5",
    weight: 8,
    image:
      "https://fanyu.vercel.app/api/album/item/1Zo_PjrXm-4TBrL2cLAeFkEl1el9kTR56",
  },
  {
    id: "6",
    weight: 3,
    image:
      "https://fanyu.vercel.app/api/album/item/19NMnVgcb-9IsknNcfe9TpCyPBIcGnhQU",
  },
];

export const payouts: Payout[] = [
  { id: "1", match_count: 2, pattern_id: "1", multiplier: 0.4 },
  { id: "2", match_count: 3, pattern_id: "1", multiplier: 1.5 },
  { id: "3", match_count: 2, pattern_id: "2", multiplier: 0.8 },
  { id: "4", match_count: 3, pattern_id: "2", multiplier: 3.0 },
  { id: "5", match_count: 2, pattern_id: "3", multiplier: 1.6 },
  { id: "6", match_count: 3, pattern_id: "3", multiplier: 11.0 },
  { id: "7", match_count: 2, pattern_id: "4", multiplier: 3.3 },
  { id: "8", match_count: 3, pattern_id: "4", multiplier: 30.0 },
  { id: "9", match_count: 2, pattern_id: "5", multiplier: 8.0 },
  { id: "10", match_count: 3, pattern_id: "5", multiplier: 105.0 },
  { id: "11", match_count: 2, pattern_id: "6", multiplier: 27.5 },
  { id: "12", match_count: 3, pattern_id: "6", multiplier: 2600.0 },
];

// --- 輔助函式 (Helpers) ---

/**
格式化數字為貨幣或百分比 (Format numbers as currency or percentage)
*/
const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
  }).format(val);

/**
 * 格式化百分比
 */
const formatPct = (val: number) => `${val.toFixed(4)}%`;

/**
 * 根據圖案和賠率計算理論統計數據。
 * 假設滾輪獨立且賠率條件互斥（例如每次旋轉只有一種賠彩）。
 */
function calculateTheoreticalStats(
  patterns: Pattern[],
  payouts: Payout[],
  bet: number,
) {
  const totalWeight = patterns.reduce((sum, p) => sum + p.weight, 0);
  let ev = 0;
  let varianceSum = 0; // E[X^2]
  const hitProbabilities: Record<number, number> = {};
  
  const payoutStats: {
    id: string;
    patternId: string;
    matchCount: number;
    prob: number;
    reward: number;
    rtpContribution: number;
  }[] = [];

  for (const payout of payouts) {
    const pattern = patterns.find((p) => p.id === payout.pattern_id);
    if (!pattern) continue;

    const p = pattern.weight / totalWeight;
    // 二項分布概率計算特定圖案數量 (假設 3 個滾輪)
    // Binomial probability for specific pattern count (assuming 3 reels)
    // k=3: p^3
    // k=2: C(3,2) * p^2 * (1-p) = 3 * p^2 * (1-p)
    const prob =
      payout.match_count === 3 ? Math.pow(p, 3) : 3 * Math.pow(p, 2) * (1 - p);

    const reward = Math.floor(payout.multiplier * bet * 1000) / 1000;
    const rtpContribution = (prob * reward / bet) * 100; // RTP 貢獻 = (概率 * 獎金 / 投注) * 100

    ev += prob * reward;
    // 假設賠率互斥: E[X^2] = sum(prob * reward^2)
    // Assuming disjoint payouts: E[X^2] = sum(prob * reward^2)
    varianceSum += prob * Math.pow(reward, 2);

    hitProbabilities[reward] = (hitProbabilities[reward] || 0) + prob;

    payoutStats.push({
      id: payout.id,
      patternId: payout.pattern_id,
      matchCount: payout.match_count,
      prob,
      reward,
      rtpContribution,
    });
  }

  const variance = varianceSum - Math.pow(ev, 2);
  const stdDev = Math.sqrt(variance);
  const rtp = (ev / bet) * 100;

  return { ev, rtp, stdDev, hitProbabilities, payoutStats };
}

// --- 模擬邏輯 (Simulation Logic) ---
function runSimulation(game: LaBaG, count: number) {
  let totalReward = 0;
  let winCount = 0;
  let maxWin = 0;
  const hitFrequency: Record<number, number> = {};

  for (let i = 0; i < count; i++) {
    const result = game.spin(BET_AMOUNT);
    totalReward += result.reward;

    if (result.reward > 0) {
      winCount++;
      if (result.reward > maxWin) maxWin = result.reward;
      hitFrequency[result.reward] = (hitFrequency[result.reward] || 0) + 1;
    }
  }

  return {
    totalReward,
    winCount,
    maxWin,
    hitFrequency,
  };
}

// --- 主要執行區塊 (Main Execution) ---

// 1. 理論分析 (Theoretical Analysis)
console.log("正在計算理論數值...");
const theo = calculateTheoreticalStats(patterns, payouts, BET_AMOUNT);

console.log("==========================================");
console.log("           理論分析 (Theoretical)          ");
console.log("==========================================");
console.log(`理論期望值 (EV) : ${theo.ev.toFixed(2)}`);
console.log(`理論 RTP        : ${theo.rtp.toFixed(2)}%`);
console.log(`標準差 (SD)     : ${theo.stdDev.toFixed(2)}`);
console.log("------------------------------------------");

console.log("\n==========================================");
console.log("           RTP 貢獻分析 (RTP Contribution) ");
console.log("==========================================");
console.log(
  `| ID | Pattern | Count | Reward | Prob (%) | RTP Contrib (%) |`,
);
console.log(
  `|----|---------|-------|--------|----------|-----------------|`,
);

theo.payoutStats.forEach((stat) => {
  console.log(
    `| ${stat.id.padEnd(2)} | ${stat.patternId.padEnd(7)} | ${stat.matchCount}     | ${stat.reward.toString().padEnd(6)} | ${(stat.prob * 100).toFixed(4).padEnd(8)} | ${stat.rtpContribution.toFixed(4).padEnd(15)} |`,
  );
});
console.log("------------------------------------------");
console.log(`總 RTP: ${theo.rtp.toFixed(2)}%`);

// 2. 模擬 (Simulation)
console.log(`\n正在執行模擬 (n=${formatCurrency(SIMULATION_COUNT)})...`);
const game = new LaBaG(patterns, payouts);
const sim = runSimulation(game, SIMULATION_COUNT);

const simEV = sim.totalReward / SIMULATION_COUNT;
const simRTP = (simEV / BET_AMOUNT) * 100;
const simHitRate = (sim.winCount / SIMULATION_COUNT) * 100;

// RTP 的信賴區間 (95% CI): 平均值 +/- 1.96 * (標準差 / sqrt(N))
// 標準誤差 (Standard Error) = 標準差 / sqrt(模擬次數)
const standardError = theo.stdDev / Math.sqrt(SIMULATION_COUNT);
// 信賴區間的邊際誤差 (Margin of Error) = 1.96 * 標準誤差
const marginOfError = 1.96 * standardError;
// RTP 的誤差百分比 = (邊際誤差 / 投注金額) * 100
const rtpMargin = (marginOfError / BET_AMOUNT) * 100;

console.log("==========================================");
console.log("           模擬結果 (Simulation)          ");
console.log("==========================================");
console.log(
  `總投注           : ${formatCurrency(BET_AMOUNT * SIMULATION_COUNT)}`,
);
console.log(`總獎金           : ${formatCurrency(sim.totalReward)}`);
console.log(`模擬期望值 (EV)   : ${simEV.toFixed(2)}`);
console.log(
  `模擬 RTP          : ${simRTP.toFixed(2)}% (95% CI: ±${rtpMargin.toFixed(2)}%)`,
);
console.log(`命中率           : ${simHitRate.toFixed(2)}%`);
console.log(`最大單次獎金      : ${sim.maxWin}`);
console.log(`誤差 (Sim - Theo) : ${(simRTP - theo.rtp).toFixed(2)}%`);

console.log("\n==========================================");
console.log("           獎金分布比較 (Distribution)     ");
console.log("==========================================");
console.log(`| 獎金   | 理論機率    | 模擬頻率    | 模擬次數  |`);
console.log(`|--------|------------|------------|----------|`);

// 取得理論和模擬中的所有唯一獎金，以確保表格完整
// Get all unique rewards from both theoretical and simulation to ensure complete table
const allRewards = Array.from(
  new Set([
    ...Object.keys(theo.hitProbabilities).map(Number),
    ...Object.keys(sim.hitFrequency).map(Number),
  ]),
).sort((a, b) => a - b);

for (const reward of allRewards) {
  const theoProb = (theo.hitProbabilities[reward] || 0) * 100;
  const simCount = sim.hitFrequency[reward] || 0;
  const simProb = (simCount / SIMULATION_COUNT) * 100;

  console.log(
    `| ${reward.toString().padEnd(6)} | ${formatPct(theoProb).padEnd(10)} | ${formatPct(simProb).padEnd(10)} | ${simCount.toString().padStart(8)} |`,
  );
}
console.log("==========================================");
