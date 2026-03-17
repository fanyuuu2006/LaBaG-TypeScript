const bet = 200;

const patternsWithPayouts = [
  {
    id: 6,
    weight: 3,
    image:
      "https://fanyu.vercel.app/api/album/item/19NMnVgcb-9IsknNcfe9TpCyPBIcGnhQU",
    probability: 0.03,
    payouts: [
      { id: 11, match_count: 2, pattern_id: 6, reward: 19873 },
      { id: 12, match_count: 3, pattern_id: 6, reward: 193541 },
    ],
  },
  {
    id: 3,
    weight: 17,
    image:
      "https://fanyu.vercel.app/api/album/item/1bMJdRB8uerQZfGYINzBI9Vaw32bZljl2",
    probability: 0.17,
    payouts: [
      { id: 5, match_count: 2, pattern_id: 3, reward: 283 },
      { id: 6, match_count: 3, pattern_id: 3, reward: 1429 },
    ],
  },
  {
    id: 4,
    weight: 12,
    image:
      "https://fanyu.vercel.app/api/album/item/1In8LF1wVfLXpPkp57a20zX84QgsAeLQx",
    probability: 0.12,
    payouts: [
      { id: 7, match_count: 2, pattern_id: 4, reward: 607 },
      { id: 8, match_count: 3, pattern_id: 4, reward: 3721 },
    ],
  },
  {
    id: 2,
    weight: 24,
    image:
      "https://fanyu.vercel.app/api/album/item/1oB-uZhPPfjfTtG4CITnb3_E-Ops9JTA0",
    probability: 0.24,
    payouts: [
      { id: 3, match_count: 2, pattern_id: 2, reward: 127 },
      { id: 4, match_count: 3, pattern_id: 2, reward: 613 },
    ],
  },
  {
    id: 1,
    weight: 36,
    image:
      "https://fanyu.vercel.app/api/album/item/1mDK1ewfLiV3fAB1HbjvwdSaDTdJdBGG3",
    probability: 0.36,
    payouts: [
      { id: 1, match_count: 2, pattern_id: 1, reward: 59 },
      { id: 2, match_count: 3, pattern_id: 1, reward: 257 },
    ],
  },
  {
    id: 5,
    weight: 8,
    image:
      "https://fanyu.vercel.app/api/album/item/1Zo_PjrXm-4TBrL2cLAeFkEl1el9kTR56",
    probability: 0.08,
    payouts: [
      { id: 9, match_count: 2, pattern_id: 5, reward: 2269 },
      { id: 10, match_count: 3, pattern_id: 5, reward: 12457 },
    ],
  },
];

const ev = patternsWithPayouts.reduce((sum, pattern) => {
  const patternEV = pattern.payouts.reduce((payoutSum, payout) => {
    return (
      payoutSum + payout.reward * pattern.probability ** payout.match_count
    );
  }, 0);
  return sum + patternEV;
}, 0);

const rtp = (ev / bet) * 100;

console.log(`Expected Value (EV): ${ev.toFixed(2)}`);
console.log(`Return to Player (RTP): ${rtp.toFixed(2)}%`);