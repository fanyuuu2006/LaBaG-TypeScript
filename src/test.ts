import { LaBaG } from "./labag";

const patterns = [
  { id: "A", weight: 50 , image: "A.png"},
  { id: "B", weight: 30 , image: "B.png"},
  { id: "C", weight: 20 , image: "C.png"},
];

const payouts = [
  { id: "payout1", pattern_id: "A", match_count: 3, reward: 100 },
  { id: "payout2", pattern_id: "B", match_count: 3, reward: 50 },
  { id: "payout3", pattern_id: "C", match_count: 3, reward: 20 },
  { id: "payout4", pattern_id: "A", match_count: 2, reward: 10 },
  { id: "payout5", pattern_id: "B", match_count: 2, reward: 5 },
  { id: "payout6", pattern_id: "C", match_count: 2, reward: 2 },
];

const labag = new LaBaG(patterns, payouts);

let totalReward = 0;
for (let i = 0; i < 10; i++) {
  const result = labag.spin();
  console.log(`Spin ${i + 1}:`, result);
  totalReward += result.reward;
}
console.log("Total Reward:", totalReward);