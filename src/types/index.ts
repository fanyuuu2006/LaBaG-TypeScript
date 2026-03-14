export type Pattern = {
  id: string;
  weight: number;
  image: string;
};

export type Payout = {
  id: string;
  pattern_id: Pattern["id"];
  match_count: number;
  reward: number;
};
